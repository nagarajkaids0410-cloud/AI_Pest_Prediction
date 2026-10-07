import os
import json
import cv2
import uuid
from flask import Flask, redirect, render_template, request, jsonify
from PIL import Image
import torchvision.transforms.functional as TF
import CNN
import numpy as np
import torch
import torch.nn.functional as F
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.cm as cm


disease_info = pd.read_csv('disease_info.csv', encoding='cp1252')
try:
    supplement_info = pd.read_csv('supplement_info.csv', encoding='utf-8')
except Exception:
    supplement_info = pd.read_csv('supplement_info.csv', encoding='cp1252')

model = CNN.CNN(39)    
model.load_state_dict(torch.load("plant_disease_model_1_latest.pt"))
model.eval()

# ─── Healthy class indices (skip severity for these) ────────────────────────
HEALTHY_INDICES = {3, 4, 5, 7, 11, 15, 18, 20, 23, 24, 25, 28, 38}


def prediction(image_path):
    """Basic prediction returning just the class index (for backward compat)."""
    image = Image.open(image_path)
    image = image.resize((224, 224))
    input_data = TF.to_tensor(image)
    input_data = input_data.view((-1, 3, 224, 224))
    output = model(input_data)
    output = output.detach().numpy()
    index = np.argmax(output)
    return index


def prediction_advanced(image_path):
    """
    Enhanced prediction returning confidence scores, top-3 predictions,
    Grad-CAM heatmap path, and severity estimation.
    """
    image = Image.open(image_path).convert('RGB')
    image_resized = image.resize((224, 224))
    input_data = TF.to_tensor(image_resized).unsqueeze(0)  # (1, 3, 224, 224)

    # --- Forward pass with softmax ---
    input_data.requires_grad_(False)
    output = model(input_data)
    probs = F.softmax(output, dim=1).detach().numpy()[0]

    top3_indices = probs.argsort()[-3:][::-1].tolist()
    top3_probs = [float(probs[i]) * 100 for i in top3_indices]
    top3_names = [disease_info['disease_name'][i] for i in top3_indices]

    pred_index = top3_indices[0]
    confidence = top3_probs[0]

    # --- Grad-CAM Heatmap ---
    heatmap_url = generate_gradcam(image_resized, input_data, pred_index, image_path)

    # --- Severity Estimation (only for diseased plants) ---
    severity_pct = None
    severity_label = None
    if pred_index not in HEALTHY_INDICES:
        severity_pct, severity_label = estimate_severity(image_path)

    return {
        'index': pred_index,
        'confidence': round(confidence, 1),
        'top3_indices': top3_indices,
        'top3_names': top3_names,
        'top3_probs': [round(p, 1) for p in top3_probs],
        'heatmap_url': heatmap_url,
        'severity_pct': severity_pct,
        'severity_label': severity_label,
    }


def generate_gradcam(image_pil, input_tensor, target_class, original_path):
    """Generate a Grad-CAM heatmap overlay and save it as an image."""
    try:
        input_tensor = input_tensor.clone().detach().requires_grad_(True)

        # Hook into the last conv layer
        activations = {}
        gradients = {}

        def forward_hook(module, inp, out):
            activations['value'] = out.detach()

        def backward_hook(module, grad_in, grad_out):
            gradients['value'] = grad_out[0].detach()

        # The last conv layer in our CNN's conv_layers is at index -1 of the Sequential
        # conv_layers has: [Conv, ReLU, BN, Conv, ReLU, BN, MaxPool] x 4
        # Last conv layer is at index -4 (before ReLU, BN, MaxPool)
        target_layer = None
        for i, layer in reversed(list(enumerate(model.conv_layers))):
            if isinstance(layer, torch.nn.Conv2d):
                target_layer = layer
                break

        if target_layer is None:
            return None

        fh = target_layer.register_forward_hook(forward_hook)
        bh = target_layer.register_full_backward_hook(backward_hook)

        # Forward + backward
        output = model(input_tensor)
        model.zero_grad()
        one_hot = torch.zeros_like(output)
        one_hot[0, target_class] = 1.0
        output.backward(gradient=one_hot)

        fh.remove()
        bh.remove()

        # Compute Grad-CAM
        grads = gradients['value']  # (1, C, H, W)
        acts = activations['value']  # (1, C, H, W)
        weights = grads.mean(dim=[2, 3], keepdim=True)  # GAP over spatial dims
        cam = (weights * acts).sum(dim=1, keepdim=True)  # (1, 1, H, W)
        cam = F.relu(cam)
        cam = cam.squeeze().numpy()

        # Normalize to [0, 1]
        if cam.max() > 0:
            cam = (cam - cam.min()) / (cam.max() - cam.min())
        else:
            cam = np.zeros_like(cam)

        # Resize to original image size
        cam_resized = cv2.resize(cam, (224, 224))

        # Create heatmap overlay
        heatmap = cm.jet(cam_resized)[:, :, :3]  # RGB heatmap
        heatmap = (heatmap * 255).astype(np.uint8)

        img_array = np.array(image_pil.resize((224, 224)))
        overlay = (0.55 * img_array + 0.45 * heatmap).astype(np.uint8)

        # Save
        heatmap_dir = os.path.join('static', 'uploads', 'heatmaps')
        os.makedirs(heatmap_dir, exist_ok=True)
        heatmap_filename = f"gradcam_{uuid.uuid4().hex[:8]}.png"
        heatmap_path = os.path.join(heatmap_dir, heatmap_filename)
        
        fig, ax = plt.subplots(1, 1, figsize=(4, 4), dpi=80)
        ax.imshow(overlay)
        ax.axis('off')
        fig.tight_layout(pad=0)
        fig.savefig(heatmap_path, bbox_inches='tight', pad_inches=0, transparent=True)
        plt.close(fig)

        return '/' + heatmap_path.replace('\\', '/')

    except Exception as e:
        print(f"Grad-CAM error: {e}")
        return None


def estimate_severity(image_path):
    """
    Estimate disease severity using color-based segmentation.
    Returns (percentage, label).
    """
    try:
        img = cv2.imread(image_path)
        if img is None:
            return None, None

        hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

        # Define healthy green range
        lower_green = np.array([25, 40, 40])
        upper_green = np.array([90, 255, 255])
        green_mask = cv2.inRange(hsv, lower_green, upper_green)

        # Define brown/yellow/necrotic disease range
        lower_brown1 = np.array([5, 40, 40])
        upper_brown1 = np.array([24, 255, 255])
        lower_brown2 = np.array([0, 40, 40])
        upper_brown2 = np.array([10, 255, 200])
        lower_yellow = np.array([15, 40, 40])
        upper_yellow = np.array([35, 255, 255])

        disease_mask = cv2.inRange(hsv, lower_brown1, upper_brown1)
        disease_mask |= cv2.inRange(hsv, lower_brown2, upper_brown2)
        disease_mask |= cv2.inRange(hsv, lower_yellow, upper_yellow)

        # Remove overlap (yellow-green ambiguity)
        disease_mask = cv2.bitwise_and(disease_mask, cv2.bitwise_not(green_mask))

        # Total leaf area = green + disease regions
        leaf_pixels = cv2.countNonZero(green_mask) + cv2.countNonZero(disease_mask)

        if leaf_pixels == 0:
            return None, None

        disease_pixels = cv2.countNonZero(disease_mask)
        severity = (disease_pixels / leaf_pixels) * 100
        severity = min(severity, 100)

        if severity < 15:
            label = 'Mild'
        elif severity < 40:
            label = 'Moderate'
        else:
            label = 'Severe'

        return round(severity, 1), label

    except Exception as e:
        print(f"Severity estimation error: {e}")
        return None, None


app = Flask(__name__)

@app.route('/')
def home_page():
    return render_template('home.html')

@app.route('/contact')
def contact():
    return render_template('contact-us.html')

@app.route('/index')
def ai_engine_page():
    return render_template('index.html')

@app.route('/mobile-device')
def mobile_device_detected_page():
    return render_template('mobile-device.html')

@app.route('/submit', methods=['GET', 'POST'])
def submit():
    if request.method == 'POST':
        image = request.files.get('image')
        if not image or image.filename == '':
            return redirect('/index')
        filename = image.filename
        upload_folder = os.path.join('static', 'uploads')
        os.makedirs(upload_folder, exist_ok=True)
        file_path = os.path.join(upload_folder, filename)
        image.save(file_path)
        print("Uploaded image saved at:", file_path)

        # Use advanced prediction with confidence, Grad-CAM, and severity
        result = prediction_advanced(file_path)
        pred = result['index']

        title = disease_info['disease_name'][pred]
        description = disease_info['description'][pred]
        prevent = disease_info['Possible Steps'][pred]
        uploaded_image_url = '/' + file_path.replace('\\', '/')
        reference_image_url = disease_info['image_url'][pred]
        supplement_name = supplement_info['supplement name'][pred]
        supplement_image_url = supplement_info['supplement image'][pred]
        supplement_buy_link = supplement_info['buy link'][pred]

        return render_template('submit.html', title=title, desc=description, prevent=prevent, 
                               image_url=uploaded_image_url, user_image=uploaded_image_url,
                               reference_image=reference_image_url,
                               pred=pred, sname=supplement_name, simage=supplement_image_url, buy_link=supplement_buy_link,
                               # New: Advanced features
                               confidence=result['confidence'],
                               top3_names=json.dumps(result['top3_names']),
                               top3_probs=json.dumps(result['top3_probs']),
                               heatmap_url=result['heatmap_url'],
                               severity_pct=result['severity_pct'],
                               severity_label=result['severity_label'])
    return redirect('/index')

@app.route('/market', methods=['GET', 'POST'])
def market():
    return render_template('market.html', supplement_image = list(supplement_info['supplement image']),
                           supplement_name = list(supplement_info['supplement name']), disease = list(disease_info['disease_name']), buy = list(supplement_info['buy link']))


# ─── AI Chat Assistant API ───────────────────────────────────────────────────

@app.route('/api/chat', methods=['POST'])
def chat_api():
    """AI Chat assistant that answers plant disease queries using the CSV knowledge base."""
    import re
    data = request.get_json()
    user_msg = data.get('message', '').strip().lower() if data else ''
    
    # Remove punctuation for better matching
    user_msg_clean = re.sub(r'[^\w\s]', '', user_msg)

    if not user_msg:
        return jsonify({'reply': "Please type a question about plant diseases, symptoms, or treatments!", 'suggestions': []})

    # Language hints
    lang_words = ['tamil', 'hindi', 'kannada', 'telugu', 'spanish', 'language', 'translate']
    if any(l in user_msg for l in lang_words):
        return jsonify({
            'reply': "🌍 **Language Support**\n\nI can speak multiple languages! To change my language, please use the **Language Dropdown** at the top right of the navigation bar.\n\nOnce you switch to Tamil, Hindi, Kannada, or Telugu, I will automatically understand and reply in that language!",
            'suggestions': ['Show all crops', 'Help']
        })

    # Greetings
    greetings = ['hi', 'hello', 'hey', 'good morning', 'good evening', 'namaste', 'hola']
    if any(g == user_msg or user_msg.startswith(g + ' ') for g in greetings):
        return jsonify({
            'reply': "Hello! 🌿 I'm your AI Plant Assistant. I can help you with:\n• Identifying plant diseases\n• Prevention and treatment steps\n• Supplement recommendations\n\nTry asking me something like \"What diseases affect tomato?\" or \"How to prevent early blight?\"",
            'suggestions': ['What diseases affect tomato?', 'How to prevent early blight?', 'Show all supported crops']
        })

    # Help / what can you do
    help_words = ['help', 'what can you do', 'features', 'how to use', 'guide']
    if any(h in user_msg for h in help_words):
        return jsonify({
            'reply': "🤖 Here's what I can help with:\n\n🔍 **Disease Lookup** — Ask about any crop disease (e.g., \"tomato leaf mold\")\n💊 **Supplements** — Get product recommendations for specific diseases\n🛡️ **Prevention** — Learn prevention steps for any disease\n🌱 **Crops** — See all supported crops and their diseases\n\nJust type naturally — I'll find the best match!",
            'suggestions': ['List all crops', 'Tomato diseases', 'Potato prevention tips']
        })

    # List all crops
    crop_words = ['all crops', 'supported crops', 'list crops', 'which crops', 'what plants', 'show crops', 'all plants']
    if any(c in user_msg_clean for c in crop_words):
        crop_names = set()
        for name in disease_info['disease_name']:
            crop = name.split(':')[0].strip() if ':' in name else name.split('_')[0].strip()
            crop_names.add(crop)
        crop_list = ', '.join(sorted(crop_names))
        return jsonify({
            'reply': f"🌱 We currently support **{len(crop_names)} crops**:\n\n{crop_list}\n\nAsk me about any of these to learn about their diseases!",
            'suggestions': [f'{list(sorted(crop_names))[0]} diseases', f'{list(sorted(crop_names))[1]} diseases']
        })

    # Search diseases by keyword
    matches = []
    for idx, row in disease_info.iterrows():
        disease_name = str(row['disease_name']).lower()
        # Clean up disease name for keyword extraction
        disease_clean = disease_name.replace('_', ' ').replace(':', ' ')
        disease_words = disease_clean.split()
        
        # Check if any significant word from the disease name exists in the user's message
        # e.g. "tomato" in "what diseases affect tomatoes" -> True
        if any(d_word in user_msg_clean for d_word in disease_words if len(d_word) > 3):
            matches.append(idx)

    if matches:
        # Check if asking about prevention
        prevention_words = ['prevent', 'cure', 'treat', 'fix', 'solve', 'stop', 'remedy', 'medicine', 'steps', 'control']
        asking_prevention = any(p in user_msg_clean for p in prevention_words)
        
        # Check if asking about supplements
        supplement_words = ['supplement', 'product', 'buy', 'fertilizer', 'medicine', 'spray', 'fungicide', 'chemical']
        asking_supplement = any(s in user_msg_clean for s in supplement_words)

        if len(matches) == 1 or asking_prevention or asking_supplement:
            idx = matches[0]
            disease_name = disease_info['disease_name'][idx]
            
            if asking_supplement:
                sname = supplement_info['supplement name'][idx]
                slink = supplement_info['buy link'][idx]
                reply = f"💊 **Recommended for {disease_name}:**\n\n**{sname}**\n\n🛒 [Buy here]({slink})"
            elif asking_prevention:
                prevent = disease_info['Possible Steps'][idx]
                reply = f"🛡️ **Prevention for {disease_name}:**\n\n{prevent}"
            else:
                desc = disease_info['description'][idx]
                reply = f"🍂 **{disease_name}**\n\n{desc}"
            
            suggestions = []
            if not asking_prevention:
                suggestions.append(f'Prevention for {disease_name}')
            if not asking_supplement:
                suggestions.append(f'Supplement for {disease_name}')
            
            return jsonify({'reply': reply, 'suggestions': suggestions})
        else:
            # Multiple matches — list them
            disease_list = '\n'.join([f"• {disease_info['disease_name'][i]}" for i in matches[:8]])
            return jsonify({
                'reply': f"🔍 I found **{len(matches)} related diseases:**\n\n{disease_list}\n\nAsk me about a specific one for details!",
                'suggestions': [disease_info['disease_name'][matches[0]], disease_info['disease_name'][matches[1]] if len(matches) > 1 else 'Show all crops']
            })

    # Fallback
    return jsonify({
        'reply': "🤔 I couldn't find an exact match for that. Try asking about:\n• A specific crop (e.g., \"tomato\", \"potato\")\n• A disease name (e.g., \"early blight\", \"leaf mold\")\n• Prevention steps or supplements\n\nOr click one of the suggestions below!",
        'suggestions': ['What diseases affect tomato?', 'Show all crops', 'How to prevent early blight?']
    })


# ─── Disease Comparison Tool ─────────────────────────────────────────────────

@app.route('/compare')
def compare_page():
    """Side-by-side disease comparison tool."""
    disease_names = list(disease_info['disease_name'])
    return render_template('compare.html', diseases=disease_names)


@app.route('/api/diseases', methods=['GET'])
def diseases_api():
    """Return all disease data as JSON for comparison tool and journal."""
    diseases = []
    for idx, row in disease_info.iterrows():
        diseases.append({
            'index': int(idx),
            'name': str(row['disease_name']),
            'description': str(row['description']),
            'prevention': str(row['Possible Steps']),
            'image_url': str(row['image_url']),
            'supplement_name': str(supplement_info['supplement name'][idx]),
            'supplement_image': str(supplement_info['supplement image'][idx]),
            'buy_link': str(supplement_info['buy link'][idx]),
            'is_healthy': idx in HEALTHY_INDICES,
        })
    return jsonify(diseases)


# ─── Weather-Based Disease Risk Forecast ─────────────────────────────────────

@app.route('/weather')
def weather_page():
    """Weather-integrated disease risk forecast page."""
    return render_template('weather.html')


# ─── Plant Health Journal ────────────────────────────────────────────────────

@app.route('/journal')
def journal_page():
    """Plant health journal and recovery tracking page."""
    return render_template('journal.html')


if __name__ == '__main__':
    app.run(debug=True)

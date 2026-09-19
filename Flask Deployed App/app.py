import os
import json
from flask import Flask, redirect, render_template, request, jsonify
from PIL import Image
import torchvision.transforms.functional as TF
import CNN
import numpy as np
import torch
import pandas as pd


disease_info = pd.read_csv('disease_info.csv', encoding='cp1252')
try:
    supplement_info = pd.read_csv('supplement_info.csv', encoding='utf-8')
except Exception:
    supplement_info = pd.read_csv('supplement_info.csv', encoding='cp1252')

model = CNN.CNN(39)    
model.load_state_dict(torch.load("plant_disease_model_1_latest.pt"))
model.eval()

def prediction(image_path):
    image = Image.open(image_path)
    image = image.resize((224, 224))
    input_data = TF.to_tensor(image)
    input_data = input_data.view((-1, 3, 224, 224))
    output = model(input_data)
    output = output.detach().numpy()
    index = np.argmax(output)
    return index


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
        pred = prediction(file_path)
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
                               pred=pred, sname=supplement_name, simage=supplement_image_url, buy_link=supplement_buy_link)
    return redirect('/index')

@app.route('/market', methods=['GET', 'POST'])
def market():
    return render_template('market.html', supplement_image = list(supplement_info['supplement image']),
                           supplement_name = list(supplement_info['supplement name']), disease = list(disease_info['disease_name']), buy = list(supplement_info['buy link']))


# ─── AI Chat Assistant API ───────────────────────────────────────────────────

@app.route('/api/chat', methods=['POST'])
def chat_api():
    """AI Chat assistant that answers plant disease queries using the CSV knowledge base."""
    data = request.get_json()
    user_msg = data.get('message', '').strip().lower() if data else ''

    if not user_msg:
        return jsonify({'reply': "Please type a question about plant diseases, symptoms, or treatments!", 'suggestions': []})

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
    crop_words = ['all crops', 'supported crops', 'list crops', 'which crops', 'what plants', 'show crops']
    if any(c in user_msg for c in crop_words):
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
        description = str(row['description']).lower()
        # Check if user message words match disease name
        if any(word in disease_name for word in user_msg.split() if len(word) > 2):
            matches.append(idx)

    if matches:
        # Check if asking about prevention
        prevention_words = ['prevent', 'cure', 'treat', 'fix', 'solve', 'stop', 'remedy', 'medicine', 'steps']
        asking_prevention = any(p in user_msg for p in prevention_words)
        
        # Check if asking about supplements
        supplement_words = ['supplement', 'product', 'buy', 'fertilizer', 'medicine', 'spray', 'fungicide']
        asking_supplement = any(s in user_msg for s in supplement_words)

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


if __name__ == '__main__':
    app.run(debug=True)


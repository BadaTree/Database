from flask import Flask, render_template, request, redirect, url_for
import os
from PIL import Image, ImageDraw

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'

def place_dot(image_path, x, y):
    image = Image.open(image_path)
    draw = ImageDraw.Draw(image)
    dot_radius = 5  # Adjust the size of the dot as needed
    dot_color = (255, 0, 0)  # Red color for the dot (adjust RGB values as needed)
    draw.ellipse([(x - dot_radius, y - dot_radius), (x + dot_radius, y + dot_radius)], fill=dot_color)
    image.save(image_path)

@app.route('/')
def index():
    return render_template(r'C:\Users\SKH\Desktop\Database\Dashboard\src\data\HanaSquare_B1.html')

@app.route('/upload', methods=['POST'])
def upload():
    image = request.files['image']
    x = int(request.form['x'])
    y = int(request.form['y'])
    
    if image:
        filename = image.filename
        image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        image.save(image_path)
        place_dot(image_path, x, y)
        return redirect(url_for('show_image', filename=filename))
    else:
        return "Image upload failed."

@app.route('/uploads/<filename>')
def show_image(filename):
    return f'<img src="/{app.config["UPLOAD_FOLDER"]}/{filename}" alt="Uploaded Image with Dot">'

if __name__ == '__main__':
    app.run(debug=True)

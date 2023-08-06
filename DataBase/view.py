from flask import Flask, render_template, request, redirect, url_for
import os
from PIL import Image, ImageDraw

app = Flask(__name__)

@app.route('/')
def index():
    return render_template(r'HanaSquare_B1.html')


if __name__ == '__main__':
    app.run(debug=True)

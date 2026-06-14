from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

posts = []

@app.route('/')
def index():
    return render_template('index.html', posts=posts)

@app.route('/docs')
def docs():
    return render_template('docs.html')

@app.route('/create', methods=['GET', 'POST'])
def create():
    if request.method == 'POST':
        title = request.form['title']
        content = request.form['content']
        post_id = max([p['id'] for p in posts], default=0) + 1
        posts.append({'id': post_id, 'title': title, 'content': content})
        return redirect(url_for('index'))
    return render_template('post.html', post=None)

@app.route('/edit/<int:post_id>', methods=['GET', 'POST'])
def edit_post(post_id):
    post = next((p for p in posts if p.get('id') == post_id), None)
    if not post:
        return redirect(url_for('index'))
    if request.method == 'POST':
        post['title'] = request.form['title']
        post['content'] = request.form['content']
        return redirect(url_for('index'))
    return render_template('post.html', post=post)

@app.route('/delete/<int:index>', methods=['POST'])
def delete_post(index):
    if 0 <= index < len(posts):
        posts.pop(index)
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
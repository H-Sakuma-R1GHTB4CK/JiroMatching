from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # ★ これを呼び出せば、基本的なCORS制限が解除される

@app.route('/echo', methods=['POST'])
def echo():
    data = request.get_json()
    print("Received data:", data)
    return jsonify({
        "status": "OK",
        "receivedData": data
    })

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)

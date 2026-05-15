import qrcode
import os

QR_DIR = "qr_codes"
os.makedirs(QR_DIR, exist_ok=True)

def generate_qr(event_id: int, base_url: str = "http://localhost:5173") -> str:
    """Guest form ka QR code generate karo"""
    guest_url = f"{base_url}/guest/{event_id}"

    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(guest_url)
    qr.make(fit=True)

    img = qr.make_image(fill_color="#1E0F08", back_color="#FDFAF5")
    path = f"{QR_DIR}/event_{event_id}.png"
    img.save(path)
    return path
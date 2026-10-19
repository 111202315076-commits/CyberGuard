# Aplikasi Web Deteksi URL Phishing Berbasis XGBoost dengan Optimasi Fitur ReliefF

## 📋 Deskripsi Proyek
Proyek ini merupakan bentuk implementasi Sistem Teknologi Informasi Terpadu (STKI) dalam aspek Keamanan Informasi. Aplikasi ini mendeteksi URL Phishing secara *real-time* berbasis *Machine Learning* tanpa menggunakan model LLM atau Vector Database.

### Model Pipeline:
1. **Feature Extraction**: Ekstraksi 19+ fitur struktural dan sintaksis dari URL.
2. **Min-Max Scaling**: Normalisasi fitur struktural.
3. **ReliefF Selection**: Memilih 37 fitur berbobot tertinggi.
4. **XGBoost Classifier**: Memprediksi probabilitas phishing (Baseline Accuracy ~98.8%).

---

## 🛠️ Cara Pelatihan Model ML

1. Letakkan file dataset `Phishing_Legitimate_full.csv` di folder `backend/data/`.
2. Masuk ke folder backend dan jalankan script pelatihan:

```bash
cd backend
python train_model.py
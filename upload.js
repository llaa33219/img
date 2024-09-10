import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";
import { v4 as uuidv4 } from "https://cdn.jsdelivr.net/npm/uuid@9.0.0/dist/esm-browser/index.js"; // UUID 생성

document.getElementById('uploadButton').addEventListener('click', async () => {
  const imageFile = document.getElementById('imageInput').files[0];
  const imageName = document.getElementById('imageName').value;

  if (!imageFile || !imageName) {
    document.getElementById('status').innerText = "이미지를 선택하고 이름을 입력하세요.";
    return;
  }

  try {
    const storage = window.firebaseStorage;
    const db = window.firebaseFirestore;

    // Firestore에서 중복 이름 확인
    const docRef = doc(db, 'images', imageName);
    const docSnap = await getDoc(docRef);

    let uniqueImageName = imageName;

    // 중복된 이름이 있으면 UUID 생성
    if (docSnap.exists()) {
      uniqueImageName = uuidv4(); // 고유한 UUID 생성
    }

    // Firebase Storage에 이미지 업로드
    const storageRef = ref(storage, uniqueImageName); // 임의의 고유 이름으로 저장
    await uploadBytes(storageRef, imageFile);
    const downloadURL = await getDownloadURL(storageRef);

    // Firestore에 이미지 정보 저장 (원래 이름 사용)
    await setDoc(doc(db, 'images', imageName), { url: downloadURL });
    document.getElementById('status').innerText = `업로드 성공! 이미지 URL: ${downloadURL}`;
  } catch (error) {
    console.error("업로드 실패:", error);
    document.getElementById('status').innerText = "업로드에 실패했습니다! 에러: " + error.message;
  }
});

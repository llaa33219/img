document.getElementById('uploadButton').addEventListener('click', async () => {
    const imageFile = document.getElementById('imageInput').files[0];
    const imageName = document.getElementById('imageName').value;
  
    if (!imageFile || !imageName) {
      document.getElementById('status').innerText = "Please select an image and provide a name.";
      return;
    }
  
    // Firebase Storage 및 Firestore 객체 사용
    const storage = window.firebaseStorage;
    const db = window.firebaseFirestore;
  
    // Firestore에서 중복 이름 확인
    const docRef = db.collection('images').doc(imageName);
    const doc = await docRef.get();
  
    if (doc.exists) {
      document.getElementById('status').innerText = "The name is already taken. Please choose another.";
      return;
    }
  
    // Firebase Storage에 이미지 업로드
    const storageRef = storage.ref(`${imageName}/${imageFile.name}`);
    
    try {
      await storageRef.put(imageFile);
      const downloadURL = await storageRef.getDownloadURL();
      
      // Firestore에 이미지 정보 저장
      await docRef.set({ url: downloadURL });
      
      document.getElementById('status').innerText = `Upload successful! Image URL: ${downloadURL}`;
    } catch (error) {
      console.error("Upload failed:", error);
      document.getElementById('status').innerText = "Upload failed!";
    }
  });
  
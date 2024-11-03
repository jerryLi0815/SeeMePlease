<template>
  <div class="app-container">
    <div class="logo" @click="turn">
      <img src="../assets/image.png" alt="Logo" />
    </div>
    <div class="beauty-container">
      <label class="custom-file-upload">
        <input type="file" @change="uploadFile" />
        Upload Audio File
      </label>
      <div
        v-if="uploadProgress !== null"
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
        "
      >
        <progress
          :value="uploadProgress"
          max="100"
          style="width: 65%"
        ></progress>
        <p style="margin: 0; font-size: 12px">
          progress: {{ uploadProgress }}%
        </p>
      </div>
    </div>
    <div class="result-container">
      <div class="result-left">
        <h3>Original Text</h3>
        <ul>
          <li
            v-for="(item, index) in uploadResult"
            :key="index"
            :class="{ highlighted: highlightedIndex === index }"
            style="margin-bottom: 20px; display: block"
          >
            <div style="display: block">
              <p><strong>input:</strong> {{ item.input }}</p>
            </div>
            <!-- <hr /> -->
          </li>
        </ul>
      </div>

      <div class="result-right" v-if="uploadResult && uploadResult.length > 0">
        <h3>Result</h3>
        <ul>
          <li
            v-for="(item, index) in uploadResult"
            :key="index"
            style="margin-bottom: 20px; display: block"
            @mouseover="highlightedIndex = index"
            @mouseleave="highlightedIndex = null"
          >
            <div style="display: block">
              <p><strong>behavior:</strong> {{ item.behavior }}</p>
              <p><strong>emotional:</strong> {{ item.emotional }}</p>
              <p><strong>reason:</strong> {{ item.reason }}</p>
            </div>
            <!-- <hr /> -->
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import { callFlaskAPI } from "../apiService";

export default {
  data() {
    return {
      uploadProgress: null,
      fileUrl: "",
      uploadResult: null,
      highlightedIndex: null,
    };
  },
  methods: {
    turn() {
      window.location.href = "https://www.seemeplease.com/";
    },
    async uploadFile(event) {
      const file = event.target.files[0];
      const storageRef = ref(storage, "uploads/" + file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          this.uploadProgress = progress;
        },
        (error) => {
          console.error("Fail upload:", error);
        },
        async () => {
          this.fileUrl = await getDownloadURL(uploadTask.snapshot.ref);
          const result = await callFlaskAPI(this.fileUrl);
          if (
            result &&
            Array.isArray(result.output) &&
            result.output.length > 0
          ) {
            this.uploadResult = result.output;
            this.$emitter.emit("sendResult", this.uploadResult); // Emit the result
          } else {
            this.uploadResult = "Cannot get any result";
          }
        }
      );
    },
  },
};
</script>

<style scoped>
body {
  font-family: "See Me Please", sans-serif;
  color: #433a2b;
  margin: 0;
  padding: 20px;
}
.custom-file-upload {
  position: relative;
  display: inline-block;
  padding: 10px 20px;
  background-color: #c7aa0c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.custom-file-upload:hover {
  background-color: #0056b3;
}

/* .upload-input {
            display: none;
        } */

.custom-file-upload::before {
  content: "📁";
  margin-right: 8px;
}

.app-container {
  display: flex;
  background-color: #ebe9e8;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  height: 100%;
}

.logo {
  width: 280px;
  height: 150px;
  margin-bottom: 20px;
  transition: all 0.2s ease;
}

.logo img {
  width: 100%;
  height: auto;
  border-radius: 10px;
}

.beauty-container {
  background-color: white;
  margin-top: 50px;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 80%;
  max-width: 1160px;
  transition: all 0.2s ease;
}

.result-container {
  display: flex;
  justify-content: space-between;
  width: 80%;
  max-width: 1200px;
  margin-top: 20px;
}

.result-left,
.result-right {
  width: 48%;
  padding: 10px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
ul {
  margin: 0;
  padding: 0;
}
.result-left ul li,
.result-right ul li {
  height: 150px;
  overflow-y: auto;
  background: #fff;
  margin: 14px;
  padding: 10px;
  /* border-radius: 15px; */
  border-bottom: 1px solid #ddd;
}
/* .result-left{
	background: #008080;	
	
}
.result-right{
	background: #FFD700;
} */
.result-left h3 {
  margin: 15px;
  /* color: #fff; */
}

.result-right h3 {
  margin: 15px;
  /* color: #fff; */
}

.highlighted {
  background-color: #ffe6e6;
}

/* .custom-file-upload {
  display: inline-block;
  padding: 6px 12px;
  cursor: pointer;
  background-color: white;
  color: black;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
} */

.custom-file-upload:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  transform: translateY(-2px);
}

.custom-file-upload input {
  display: none;
}
</style>

document.addEventListener("DOMContentLoaded", function () {
  const aquarium = document.getElementById("aquarium");

  let fishCount = 0;
  let speedMultiplier = 1;
  let bubblesEnabled = true;

  // Biến quản lý âm thanh
  let soundEnabled = true;
  let backgroundMusic = null;
  let addSound = null;

  // Khởi tạo âm thanh
  function initSounds() {
    backgroundMusic = new Audio("sound/bg_music.mp3");
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3;

    addSound = new Audio("sound/add_music.mp3");
    addSound.volume = 0.5;
  }

  function toggleSound() {
    soundEnabled = !soundEnabled;

    if (soundEnabled) {
      backgroundMusic.play().catch((e) => console.log("Lỗi phát nhạc nền:", e));
    } else {
      backgroundMusic.pause();
      addSound.pause();
    }

    const soundButton = document.getElementById("toggleSound");
    if (soundButton) {
      soundButton.textContent = soundEnabled ? "Tắt Âm Thanh" : "Bật Âm Thanh";
    }
  }

  function playAddSound() {
    if (soundEnabled && addSound) {
      addSound.currentTime = 0;
      addSound
        .play()
        .catch((e) => console.log("Lỗi phát âm thanh thêm cá:", e));
    }
  }

  function playBackgroundMusic() {
    if (soundEnabled && backgroundMusic) {
      backgroundMusic.play().catch((e) => console.log("Lỗi phát nhạc nền:", e));
    }
  }

  initSounds();

  setTimeout(() => {
    playBackgroundMusic();
  }, 1000);

  createMenu();

  // Bong bóng
  function createBubble() {
    if (!bubblesEnabled) return;

    const bubble = document.createElement("div");
    bubble.classList.add("bubble");

    const size = Math.random() * 20 + 5;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;

    const left = Math.random() * 100;
    bubble.style.left = `${left}%`;
    bubble.style.bottom = "0";

    aquarium.appendChild(bubble);

    setTimeout(() => {
      if (bubble.parentNode) bubble.parentNode.removeChild(bubble);
    }, 5000);
  }

  setInterval(createBubble, 500);

  // TẠO CÁ / DIVER
  function createFish(includeDrivers = true) {
    const fish = document.createElement("div");
    fish.classList.add("fish");

    let fishTypes;
    if (includeDrivers) {
      fishTypes = [
        "diver1",
        "diver2",
        "diver3",
        "faintSchool",
        "goldFishSchool",
        "shark",
        "turtle",
      ];
    } else {
      fishTypes = ["faintSchool", "goldFishSchool", "shark", "turtle"];
    }

    const randomFish = fishTypes[Math.floor(Math.random() * fishTypes.length)];
    const isDiver = randomFish.includes("diver");

    const fishImage = document.createElement("img");
    fishImage.src = `assets/images/${randomFish}.png`;
    fishImage.alt = `Cá ${randomFish}`;
    fishImage.classList.add("fish-image");

    // ⭐ Làm cá mập to hơn
    if (randomFish === "shark") {
      fishImage.style.width = "220px";
      fishImage.style.height = "auto";
    }

    fish.appendChild(fishImage);
    fish.id = `fish-${fishCount}`;
    fishCount++;

    // Kích thước thực tế
    let fishWidth, fishHeight;
    if (randomFish === "shark") {
      fishWidth = 220;
      fishHeight = 110;
    } else if (isDiver) {
      fishWidth = 60;
      fishHeight = 100;
    } else {
      fishWidth = 120;
      fishHeight = 60;
    }

    let startX, startY, direction;

    if (isDiver) {
      // ⭐ Diver lặn phạm vi ngắn + luôn tiến tới
      startX = Math.random() * (aquarium.offsetWidth - fishWidth);
      startY = Math.random() * (aquarium.offsetHeight - fishHeight - 200) + 100;

      direction = Math.random() > 0.5 ? 1 : -1;
      fish.style.transform =
        direction === 1 ? "rotate(45deg)" : "rotate(-45deg)";
    } else {
      startX = Math.random() * (aquarium.offsetWidth - fishWidth);
      startY = Math.random() * (aquarium.offsetHeight - fishHeight);
      direction = Math.random() > 0.5 ? 1 : -1;
      fish.style.transform = `scaleX(${direction})`;
    }

    fish.style.left = `${startX}px`;
    fish.style.top = `${startY}px`;

    aquarium.appendChild(fish);

    playAddSound();

    // SPEED GỐC
    const baseSpeed = (Math.random() * 0.6 + 0.3) * speedMultiplier;

    // ⭐ Cá mập bơi nhanh hơn
    let actualSpeed = baseSpeed;
    if (randomFish === "shark") {
      actualSpeed *= 2.8; // tăng tốc cá mập
    }

    // ⭐ Diver di chuyển
    // ⭐ Diver di chuyển
    function moveDiver() {
      if (!fish.parentNode) return;

      let currentX = parseFloat(fish.style.left);
      let currentY = parseFloat(fish.style.top);

      currentY += actualSpeed * direction * 1.0;
      currentX += actualSpeed * 0.6 * direction; // ⭐ thêm direction vào X để đảo hướng khi va chạm

      const lowBound = 60;
      const highBound = aquarium.offsetHeight - fishHeight - 160;

      // ⭐ Giới hạn trục Y
      if (currentY >= highBound) {
        currentY = highBound;
        direction = -1;
        fish.style.transform = "rotate(-40deg)";
      } else if (currentY <= lowBound) {
        currentY = lowBound;
        direction = 1;
        fish.style.transform = "rotate(40deg)";
      }

      // ⭐ Giới hạn trục X — CHẠM VIỀN THÌ QUAY LẠI
      if (currentX <= 0) {
        currentX = 0;
        direction = 1;
        fish.style.transform = "rotate(40deg)";
      } else if (currentX >= aquarium.offsetWidth - fishWidth) {
        currentX = aquarium.offsetWidth - fishWidth;
        direction = -1;
        fish.style.transform = "rotate(-40deg)";
      }

      fish.style.left = `${currentX}px`;
      fish.style.top = `${currentY}px`;

      requestAnimationFrame(moveDiver);
    }

    // Cá bơi bình thường
    function moveFish() {
      if (!fish.parentNode) return;

      let currentX = parseFloat(fish.style.left);
      let currentY = parseFloat(fish.style.top);

      currentX += actualSpeed * direction;

      if (currentX <= 0) {
        currentX = 0;
        direction = 1;
        fish.style.transform = "scaleX(1)";
      } else if (currentX >= aquarium.offsetWidth - fishWidth) {
        currentX = aquarium.offsetWidth - fishWidth;
        direction = -1;
        fish.style.transform = "scaleX(-1)";
      }

      currentY += Math.sin(Date.now() / 1000 + fishCount) * 0.2;

      if (currentY < 0) currentY = 0;
      if (currentY > aquarium.offsetHeight - fishHeight) {
        currentY = aquarium.offsetHeight - fishHeight;
      }

      fish.style.left = `${currentX}px`;
      fish.style.top = `${currentY}px`;

      requestAnimationFrame(moveFish);
    }

    if (isDiver) moveDiver();
    else moveFish();
  }

  // Menu
  function createMenu() {
    const menuButton = document.createElement("div");
    menuButton.classList.add("menu-button");
    menuButton.innerHTML = `
            <span></span><span></span><span></span>
        `;

    const menuContent = document.createElement("div");
    menuContent.classList.add("menu-content");
    menuContent.innerHTML = `
            <button id="addFish">Thêm Cá</button>
            <button id="removeFish">Bớt Cá</button>
            <button id="speedUp">Tăng Tốc</button>
            <button id="speedDown">Giảm Tốc</button>
            <button id="toggleBubbles">Bật/Tắt Bong Bóng</button>
            <button id="toggleSound">Tắt Âm Thanh</button>
            <button id="changeBg">Đổi Background</button>
        `;

    document.body.appendChild(menuButton);
    document.body.appendChild(menuContent);

    menuButton.addEventListener("click", function () {
      menuContent.classList.toggle("active");
    });

    document.addEventListener("click", function (event) {
      if (!menuContent.contains(event.target) && event.target !== menuButton) {
        menuContent.classList.remove("active");
      }
    });

    const backgrounds = [
      "assets/images/background_tank.png",
      "assets/images/background_tank2.webp",
      "assets/images/background_tank3.jpg",
    ];

    let currentBg = 0;

    document.getElementById("changeBg").addEventListener("click", function () {
      currentBg = (currentBg + 1) % backgrounds.length;

      document.body.style.background = `
        url(${backgrounds[currentBg]}) no-repeat center center fixed
    `;
      document.body.style.backgroundSize = "cover";
    });

    document.getElementById("addFish").addEventListener("click", function () {
      if (fishCount < 15) createFish(false);
      else alert("Đã đạt số lượng cá tối đa (15 con)!");
    });

    document
      .getElementById("removeFish")
      .addEventListener("click", function () {
        if (fishCount > 0) {
          const lastFish = document.getElementById(`fish-${fishCount - 1}`);
          if (lastFish) lastFish.remove();
          fishCount--;
        }
      });

    document.getElementById("speedUp").addEventListener("click", function () {
      if (speedMultiplier < 3) speedMultiplier += 0.5;
    });

    document.getElementById("speedDown").addEventListener("click", function () {
      if (speedMultiplier > 0.5) speedMultiplier -= 0.5;
    });

    document
      .getElementById("toggleBubbles")
      .addEventListener("click", function () {
        bubblesEnabled = !bubblesEnabled;
      });

    document
      .getElementById("toggleSound")
      .addEventListener("click", function () {
        toggleSound();
      });
  }

  for (let i = 0; i < 3; i++) {
    createFish(true);
  }
});

document.addEventListener('DOMContentLoaded', function() {
          const aquarium = document.getElementById('aquarium');
          
          let fishCount = 0;
          let speedMultiplier = 1;
          let bubblesEnabled = true;
          
          // Biến quản lý âm thanh
          let soundEnabled = true;
          let backgroundMusic = null;
          let addSound = null;
          
          // Khởi tạo âm thanh
          function initSounds() {
              // Nhạc nền
              backgroundMusic = new Audio('sound/bg_music.mp3');
              backgroundMusic.loop = true;
              backgroundMusic.volume = 0.3;
              
              // Âm thanh thêm cá
              addSound = new Audio('sound/add_music.mp3');
              addSound.volume = 0.5;
          }
          
          // Hàm bật/tắt âm thanh
          function toggleSound() {
              soundEnabled = !soundEnabled;
              
              if (soundEnabled) {
                  backgroundMusic.play().catch(e => console.log('Lỗi phát nhạc nền:', e));
              } else {
                  backgroundMusic.pause();
                  addSound.pause();
              }
              
              // Cập nhật text nút
              const soundButton = document.getElementById('toggleSound');
              if (soundButton) {
                  soundButton.textContent = soundEnabled ? 'Tắt Âm Thanh' : 'Bật Âm Thanh';
              }
          }
          
          // Hàm phát âm thanh thêm cá
          function playAddSound() {
              if (soundEnabled && addSound) {
                  addSound.currentTime = 0;
                  addSound.play().catch(e => console.log('Lỗi phát âm thanh thêm cá:', e));
              }
          }
          
          // Hàm phát nhạc nền
          function playBackgroundMusic() {
              if (soundEnabled && backgroundMusic) {
                  backgroundMusic.play().catch(e => console.log('Lỗi phát nhạc nền:', e));
              }
          }
          
          // Khởi tạo âm thanh
          initSounds();
          
          // Tự động phát nhạc nền sau 1 giây
          setTimeout(() => {
              playBackgroundMusic();
          }, 1000);
          
          // Tạo menu
          createMenu();
          
          // Tạo bong bóng
          function createBubble() {
              if (!bubblesEnabled) return;
              
              const bubble = document.createElement('div');
              bubble.classList.add('bubble');
              
              const size = Math.random() * 20 + 5;
              bubble.style.width = `${size}px`;
              bubble.style.height = `${size}px`;
              
              const left = Math.random() * 100;
              bubble.style.left = `${left}%`;
              bubble.style.bottom = '0';
              
              aquarium.appendChild(bubble);
              
              // Xóa bong bóng sau khi hoàn thành animation
              setTimeout(() => {
                  if (bubble.parentNode) {
                      bubble.parentNode.removeChild(bubble);
                  }
              }, 5000);
          }
          
          // Tạo bong bóng định kỳ
          setInterval(createBubble, 500);
          
          // Tạo cá mới
          function createFish() {
              const fish = document.createElement('div');
              fish.classList.add('fish');
              
              // Chọn ngẫu nhiên loại cá
              const fishTypes = ['diver1', 'diver2', 'diver3', 'faintSchool', 'goldfishSchool', 'shark', 'turtle'];
              const randomFish = fishTypes[Math.floor(Math.random() * fishTypes.length)];
              
              // Tạo hình ảnh cá
              const fishImage = document.createElement('img');
              fishImage.src = `assets/images/${randomFish}.png`;
              fishImage.alt = `Cá ${randomFish}`;
              fishImage.classList.add('fish-image');
              
              fish.appendChild(fishImage);
              fish.id = `fish-${fishCount}`;
              fishCount++;
              
              // Xác định kích thước dựa trên loại cá
              let fishWidth, fishHeight;
              if (randomFish === 'shark') {
                  fishWidth = 160;
                  fishHeight = 80;
              } else {
                  fishWidth = 120;
                  fishHeight = 60;
              }
              
              // Vị trí và hướng ban đầu ngẫu nhiên
              const startX = Math.random() * (aquarium.offsetWidth - fishWidth);
              const startY = Math.random() * (aquarium.offsetHeight - fishHeight);
              let direction = Math.random() > 0.5 ? 1 : -1; // 1: phải, -1: trái
              
              fish.style.left = `${startX}px`;
              fish.style.top = `${startY}px`;
              fish.style.transform = `scaleX(${direction})`;
              
              aquarium.appendChild(fish);
              
              // Phát âm thanh khi thêm cá
              playAddSound();
              
              const speed = (Math.random() * 0.6 + 0.3) * speedMultiplier;
              
              // Hàm di chuyển cá
              function moveFish() {
                  if (!fish.parentNode) return; // Nếu cá đã bị xóa
                  
                  let currentX = parseFloat(fish.style.left);
                  let currentY = parseFloat(fish.style.top);
                  
                  // Di chuyển theo hướng hiện tại
                  currentX += speed * direction;
                  
                  // Kiểm tra va chạm với viền
                  if (currentX <= 0) {
                      currentX = 0;
                      direction = 1; // Đổi hướng sang phải
                      fish.style.transform = 'scaleX(1)';
                  } else if (currentX >= aquarium.offsetWidth - fishWidth) {
                      currentX = aquarium.offsetWidth - fishWidth;
                      direction = -1; // Đổi hướng sang trái
                      fish.style.transform = 'scaleX(-1)';
                  }
                  
                  // Di chuyển lên xuống nhẹ
                  currentY += Math.sin(Date.now() / 1000 + fishCount) * 0.2; // Giảm biên độ lên xuống
                  
                  // Giữ cá trong phạm vi hồ
                  if (currentY < 0) currentY = 0;
                  if (currentY > aquarium.offsetHeight - fishHeight) currentY = aquarium.offsetHeight - fishHeight;
                  
                  fish.style.left = `${currentX}px`;
                  fish.style.top = `${currentY}px`;
                  
                  requestAnimationFrame(moveFish);
              }
              
              moveFish();
          }
          
          // Tạo menu điều khiển
          function createMenu() {
              const menuButton = document.createElement('div');
              menuButton.classList.add('menu-button');
              menuButton.innerHTML = `
                  <span></span>
                  <span></span>
                  <span></span>
              `;
              
              const menuContent = document.createElement('div');
              menuContent.classList.add('menu-content');
              menuContent.innerHTML = `
                  <button id="addFish">Thêm Cá</button>
                  <button id="removeFish">Bớt Cá</button>
                  <button id="speedUp">Tăng Tốc</button>
                  <button id="speedDown">Giảm Tốc</button>
                  <button id="toggleBubbles">Bật/Tắt Bong Bóng</button>
                  <button id="toggleSound">Tắt Âm Thanh</button>
              `;
              
              document.body.appendChild(menuButton);
              document.body.appendChild(menuContent);
              
              // Xử lý sự kiện toggle menu
              menuButton.addEventListener('click', function() {
                  menuContent.classList.toggle('active');
              });
              
              // Đóng menu khi click ra ngoài hoặc click lại menu button
              document.addEventListener('click', function(event) {
                  if (!menuContent.contains(event.target) && event.target !== menuButton) {
                      menuContent.classList.remove('active');
                  }
              });
              
              // Xử lý sự kiện nút thêm cá
              document.getElementById('addFish').addEventListener('click', function() {
                  if (fishCount < 15) {
                      createFish();
                  } else {
                      alert('Đã đạt số lượng cá tối đa (15 con)!');
                  }
              });
              
              // Xử lý sự kiện nút bớt cá
              document.getElementById('removeFish').addEventListener('click', function() {
                  if (fishCount > 0) {
                      const lastFish = document.getElementById(`fish-${fishCount - 1}`);
                      if (lastFish) {
                          lastFish.remove();
                          fishCount--;
                      }
                  }
              });
              
              // Xử lý sự kiện tăng tốc
              document.getElementById('speedUp').addEventListener('click', function() {
                  if (speedMultiplier < 3) {
                      speedMultiplier += 0.5;
                  }
              });
              
              // Xử lý sự kiện giảm tốc
              document.getElementById('speedDown').addEventListener('click', function() {
                  if (speedMultiplier > 0.5) {
                      speedMultiplier -= 0.5;
                  }
              });
              
              // Xử lý sự kiện bật/tắt bong bóng
              document.getElementById('toggleBubbles').addEventListener('click', function() {
                  bubblesEnabled = !bubblesEnabled;
              });
              
              // Xử lý sự kiện bật/tắt âm thanh
              document.getElementById('toggleSound').addEventListener('click', function() {
                  toggleSound();
              });
          }
          
          // Tạo 3 con cá ban đầu
          for (let i = 0; i < 3; i++) {
              createFish();
          }
      });

let participantCount = 0;
let activeParticipants = 0;
let currentPhotoBase64 = null;

const elements = {
  form: document.getElementById('registration-form'),
  dateInput: document.getElementById('inp-daftar'),
  photoInput: document.getElementById('inp-foto'),
  photoPreview: document.getElementById('photo-preview'),
  resetBtn: document.getElementById('btn-reset'),
  cardContainer: document.getElementById('card-container'),
  emptyState: document.getElementById('empty-state'),
  countBadge: document.getElementById('count-badge'),
  toast: document.getElementById('toast'),
};

const THEME_MAP = {
  DayPass: { color: '#a1a1aa', label: 'DAY PASS', border: 'border-zinc-400' },
  Monthly: { color: '#facc15', label: 'MONTHLY', border: 'border-goodang-yellow' },
  Annual: { color: '#ef4444', label: 'ANNUAL PRO', border: 'border-red-500' }
};


const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

const showToast = (message, type = 'success') => {
  elements.toast.textContent = message;
  elements.toast.style.borderLeftColor = type === 'error' ? '#ef4444' : '#facc15';

  elements.toast.classList.remove('translate-x-full', 'opacity-0');
  setTimeout(() => {
    elements.toast.classList.add('translate-x-full', 'opacity-0');
  }, 3000);
};

const formatMemberID = (count) => {
  const year = new Date().getFullYear();
  const padCount = String(count).padStart(4, '0');
  return `GB-${year}-${padCount}`;
};


const updateUIState = () => {
  elements.countBadge.textContent = activeParticipants;
  elements.emptyState.style.display = activeParticipants === 0 ? 'block' : 'none';
};

const resetPhoto = () => {
  currentPhotoBase64 = null;
  elements.photoPreview.innerHTML = `
    <svg class="w-8 h-8 text-zinc-400 transform skew-x-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
    </svg>`;
};

elements.photoInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (file.size > 2 * 1024 * 1024) {
    showToast('⚠️ Ukuran foto maksimal 2MB', 'error');
    elements.photoInput.value = '';
    return;
  }

  try {
    currentPhotoBase64 = await getBase64(file);
    elements.photoPreview.innerHTML = `<img src="${currentPhotoBase64}" class="w-full h-full object-cover transform skew-x-3 scale-110" />`;
  } catch (error) {
    showToast('❌ Gagal memproses foto', 'error');
  }
});

elements.resetBtn.addEventListener('click', resetPhoto);


const createCardHTML = (data, idNumber) => {
  const theme = THEME_MAP[data.tipe];
  const memberId = formatMemberID(idNumber);
  
  const photoSrc = currentPhotoBase64 || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2352525b'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E`;

  return `
    <div id="wrapper-${idNumber}" class="relative w-[380px] flex flex-col gap-4 shrink-0">
      
      <!-- ACTUAL CARD (GEAR TAG) -->
      <div id="card-${idNumber}" class="relative w-[380px] h-[260px] bg-goodang-gear shadow-card-shadow text-white border-[3px] border-goodang-black grip-texture overflow-hidden select-none rounded-b-xl rounded-t-sm">
        
        <!-- Lanyard / Quickdraw Clip Hole -->
        <div class="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-4 bg-goodang-black border-2 border-zinc-600 rounded-full shadow-inner z-20"></div>

        <!-- Left Yellow Accent Stripe -->
        <div class="absolute top-0 left-0 bottom-0 w-4 bg-goodang-yellow border-r-[3px] border-goodang-black z-10"></div>

        <!-- Watermark Carabiner SVG (Right Side) -->
        <div class="absolute -right-8 top-10 opacity-10 pointer-events-none transform rotate-12">
          <svg width="180" height="180" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10 21h4c3.3 0 6-2.7 6-6V9c0-3.3-2.7-6-6-6h-4c-3.3 0-6 2.7-6 6v6c0 3.3 2.7 6 6 6z"/>
            <path d="M14 3v18" stroke-dasharray="2 2" stroke="yellow" stroke-width="2"/>
            <path d="M8 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
          </svg>
        </div>

        <div class="relative h-full flex flex-col justify-between pt-10 pb-5 pl-8 pr-5 z-10">
          
          <!-- Card Header -->
          <div class="flex justify-between items-start mb-2">
            <div>
              <h2 class="font-display font-black text-2xl tracking-wide uppercase leading-none">GOODANG</h2>
              <h2 class="font-display font-black text-xl tracking-wide uppercase leading-none text-goodang-yellow">BOULDERING</h2>
            </div>
            <!-- Jargon / Climbing Slang -->
            <div class="text-right">
              <span class="block font-sans font-black text-[0.55rem] tracking-[0.2em] text-zinc-400">CHALK UP.</span>
              <span class="block font-sans font-black text-[0.55rem] tracking-[0.2em] text-zinc-400">SEND IT.</span>
            </div>
          </div>

          <!-- Card Body: User Data -->
          <div class="flex items-center gap-4 mb-2">
            
            <!-- Photo Box with Finger Tape Accents -->
            <div class="relative w-[85px] h-[85px] bg-zinc-800 border-2 border-zinc-700">
              <!-- Top Left Tape -->
              <div class="absolute -top-1.5 -left-2 w-7 h-2.5 bg-zinc-100 rotate-[-35deg] border border-zinc-300 shadow-sm z-20"></div>
              <!-- Bottom Right Tape -->
              <div class="absolute -bottom-1.5 -right-2 w-7 h-2.5 bg-zinc-100 rotate-[-35deg] border border-zinc-300 shadow-sm z-20"></div>
              
              <div class="w-full h-full overflow-hidden filter grayscale contrast-125">
                <img src="${photoSrc}" class="w-full h-full object-cover" crossorigin="anonymous" />
              </div>
            </div>

            <!-- Details -->
            <div class="flex-1 bg-goodang-black/50 p-2 border border-zinc-700/50 rounded-sm">
              <p class="text-[0.55rem] font-bold text-goodang-yellow uppercase tracking-widest mb-0.5">Climber Name</p>
              <h3 class="font-display font-bold text-lg uppercase tracking-wide leading-none mb-2 truncate">${data.nama}</h3>
              
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <p class="text-[0.5rem] font-bold text-zinc-500 uppercase tracking-widest">Category</p>
                  <p class="text-[0.65rem] font-bold text-zinc-200 uppercase truncate">${data.jurusan}</p>
                </div>
                <div>
                  <p class="text-[0.5rem] font-bold text-zinc-500 uppercase tracking-widest">ID / KTP</p>
                  <p class="text-[0.65rem] font-bold text-zinc-200">${data.nim}</p>
                </div>
              </div>
            </div>

          </div>

          <!-- Card Footer: Access ID & Tier -->
          <div class="flex justify-between items-end mt-1 border-t-2 border-dashed border-zinc-700 pt-2">
             <div class="bg-goodang-yellow text-goodang-black py-0.5 px-3 font-mono text-[0.7rem] font-bold tracking-widest transform -skew-x-12">
               <span class="block transform skew-x-12">${memberId}</span>
             </div>
             <div class="border-2 ${theme.border} px-3 py-0.5 bg-goodang-black">
               <span class="block font-display font-bold text-[0.65rem] tracking-widest text-white uppercase">${theme.label}</span>
             </div>
          </div>

        </div>
      </div>

      <!-- ACTION BUTTONS -->
      <div class="flex justify-end gap-3 px-1">
        <button data-action="delete" data-target="wrapper-${idNumber}" class="font-display font-bold text-sm text-zinc-500 hover:text-red-500 transition-colors uppercase tracking-wider px-2">
          Hapus
        </button>
        <button data-action="download" data-target="card-${idNumber}" class="bg-goodang-black hover:bg-zinc-800 text-goodang-yellow border-2 border-goodang-black font-display font-bold text-sm py-1.5 px-5 uppercase tracking-wider transition-all flex items-center gap-2 shadow-[2px_2px_0px_0px_#facc15] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          Download Tag
        </button>
      </div>
    </div>
  `;
};


const handleFormSubmit = (e) => {
  e.preventDefault();
  
  const formData = new FormData(elements.form);
  const data = Object.fromEntries(formData.entries());
  
  if (!currentPhotoBase64) {
    showToast('⚠️ Mohon upload foto climber', 'error');
    return;
  }

  participantCount++;
  activeParticipants++;
  
  const cardHtml = createCardHTML(data, participantCount);
  elements.cardContainer.insertAdjacentHTML('afterbegin', cardHtml); 
  
  updateUIState();
  elements.form.reset();
  resetPhoto();
  
  elements.dateInput.value = new Date().toISOString().split('T')[0];
  showToast(`✅ Climber ${data.nama} Berhasil Clip-In!`);
};

const handleCardAction = async (e) => {
  const button = e.target.closest('button');
  if (!button) return;

  const action = button.dataset.action;
  const targetId = button.dataset.target;
  const element = document.getElementById(targetId);

  if (!element) return;

  if (action === 'delete') {
    element.classList.add('opacity-0', 'scale-95', 'transition-all');
    setTimeout(() => { 
      element.remove(); 
      activeParticipants--;
      updateUIState(); 
    }, 250);
  }

  if (action === 'download') {
    const originalText = button.innerHTML;
    button.innerHTML = 'RENDERING...';
    button.disabled = true;

    try {
      const canvas = await html2canvas(element, { 
        backgroundColor: null,
        scale: 3, 
        useCORS: true,
        logging: false
      });
      
      const link = document.createElement('a');
      link.download = `GB-GearTag-${targetId.split('-')[1]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      showToast('📥 Gear Tag berhasil didownload');
    } catch (error) {
      showToast('❌ Gagal merender tag', 'error');
    } finally {
      button.innerHTML = originalText;
      button.disabled = false;
    }
  }
};


const init = () => {
  elements.dateInput.value = new Date().toISOString().split('T')[0];
  elements.form.addEventListener('submit', handleFormSubmit);
  elements.cardContainer.addEventListener('click', handleCardAction);
};

document.addEventListener('DOMContentLoaded', init);
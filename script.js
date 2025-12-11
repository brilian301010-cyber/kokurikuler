document.addEventListener('DOMContentLoaded', function() {
    
    // ===================================================
    // DATA ITEM KOLEKSI (Digunakan oleh Filter dan Modal)
    // ===================================================

    // Asumsi: Semua item koleksi memiliki atribut data-id di HTML (e.g., data-id="batik")
    const itemDetails = {
        'bandeng': {
            title: "Pesta Delta Bandeng",
            text: "Festival tahunan yang merayakan hasil tambak utama Sidoarjo. Acara ini mencakup lelang bandeng super, tarian tradisional yang terinspirasi dari gerakan ikan, dan pertunjukan rakyat yang ramai, melambangkan kemakmuran pesisir.",
            category: "Festival"
        },
        'batik': {
            title: "Batik Tulis Jetis",
            text: "Batik Jetis adalah warisan kriya yang telah ada sejak era Majapahit, diadaptasi dengan motif udang dan bandeng yang melambangkan kekayaan delta. Prosesnya masih menggunakan canting dan pewarna alami yang khas dari sentra Jetis.",
            category: "Pameran"
        },
        'kuliner': {
            title: "Dapur Legenda Sidoarjo (Kupang Lontong)",
            text: "Kuliner ikonik Kupang Lontong menjadi sorotan. Dapur Legenda bertujuan mensertifikasi resep otentik yang menggunakan Petis Udang Sidoarjo terbaik, disajikan dengan lentho dan sate kerang.",
            category: "Kuliner"
        },
        'sastra': {
            title: "Mocopat & Parikan Pesisir",
            text: "Sastra lisan ini adalah bentuk pantun dan puisi tradisional yang mengandung humor, sindiran sosial, dan nilai-nilai lokal. Program ini melestarikan tradisi lisan di kalangan generasi muda Sidoarjo.",
            category: "Sastra"
        },
        'tambak': {
            title: "Kearifan Tambak & Petani Garam",
            text: "Pengetahuan tradisional tentang siklus air payau, waktu terbaik menabur benih, dan teknik panen garam yang ramah lingkungan. Pengetahuan ini adalah kunci adaptasi masyarakat terhadap ekosistem delta.",
            category: "Pengetahuan"
        }
    };

    // ===================================================
    // Variabel Global & DOM Elements
    // ===================================================
    const navLinks = document.querySelectorAll('nav ul li a');
    const sections = document.querySelectorAll('section');
    const mainHeader = document.querySelector('.main-header'); // Asumsi ada elemen .main-header atau ganti dengan 'nav' jika itu yang lengket
    const headerHeight = mainHeader ? mainHeader.offsetHeight : 0; // Mengambil tinggi header untuk kompensasi scrollspy
    
    // Elemen untuk Filter
    const searchInput = document.getElementById('searchInput'); // Asumsi ID ini ada
    const filterSelect = document.getElementById('filterSelect'); // Asumsi ID ini ada
    const gridItems = document.querySelectorAll('.grid-item');
    
    // Elemen untuk Modal
    const modalOverlay = document.getElementById('itemModal'); // Asumsi ID ini ada
    const modalTitle = document.getElementById('modal-title');
    const modalContentText = document.getElementById('modal-content-text');
    const detailLinks = document.querySelectorAll('.grid-item a'); // Tautan detail di dalam kartu

    
    // ===================================================
    // 1. Smooth Scrolling untuk tautan navigasi (TETAP SAMA)
    // ===================================================

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.hash !== "") {
                e.preventDefault();
                const hash = this.hash;
                
                document.querySelector(hash).scrollIntoView({
                    behavior: 'smooth',
                    block: 'start' // Pastikan scroll ke bagian atas section
                });
            }
        });
    });


    // ===================================================
    // 2. Menandai Tautan Navigasi Aktif saat Menggulir (Scrollspy)
    // ===================================================

    // NEW: Fungsi untuk menambahkan/menghapus kelas sticky pada header/nav
    function handleScroll() {
        // Logika Scrollspy
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight;
            const sectionHeight = section.clientHeight;
            
            // Kompensasi scroll 50px di bawah header
            if (window.scrollY >= sectionTop - 50 && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        // Logika Kelas Aktif
        navLinks.forEach(link => {
            link.classList.remove('active');
        });

        const activeLink = document.querySelector(`nav ul li a[href="#${current}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // Logika Sticky Header Styling (Fitur Baru)
        const navBar = document.querySelector('nav');
        if (window.scrollY > 150) { // Jika scroll melewati 150px
            navBar.classList.add('nav-scrolled');
        } else {
            navBar.classList.remove('nav-scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll);
    // Jalankan sekali saat load untuk menandai section pertama
    handleScroll(); 


    // ===================================================
    // 3. Fungsionalitas Modal Detail Item (Fitur Baru)
    // ===================================================

    // Fungsi Pembuka Modal
    function openModal(itemKey) {
        if (!itemDetails[itemKey]) return;

        const data = itemDetails[itemKey];
        
        modalTitle.textContent = data.title;
        modalContentText.textContent = data.text;
        
        modalOverlay.classList.add('active'); 
        document.body.style.overflow = 'hidden'; // Kunci scroll
    }

    // Fungsi Penutup Modal
    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = 'auto'; // Buka scroll
    }

    // Event Listener untuk semua link detail di kartu
    detailLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            // Ambil ID item dari data-id pada parent .grid-item
            const itemElement = this.closest('.grid-item');
            const itemKey = itemElement ? itemElement.getAttribute('data-id') : null;
            if (itemKey) {
                openModal(itemKey);
            }
        });
    });
    
    // Event Listener untuk tombol close dan klik di luar modal
    const modalCloseBtn = document.querySelector('.modal-close-btn');
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            // Hanya tutup jika mengklik overlay, bukan konten modal
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }

    // ===================================================
    // 4. Fungsionalitas Filter & Pencarian (Fitur Baru)
    // ===================================================
    
    function applyFilters() {
        const searchText = searchInput.value.toLowerCase();
        const selectedCategory = filterSelect.value.toLowerCase();

        gridItems.forEach(item => {
            // Mengambil data-id dan data-category yang sudah ada di HTML
            const itemTitle = itemDetails[item.getAttribute('data-id')].title.toLowerCase(); 
            const itemCategory = itemDetails[item.getAttribute('data-id')].category.toLowerCase();
            
            const matchesSearch = itemTitle.includes(searchText);
            const matchesCategory = selectedCategory === "" || itemCategory === selectedCategory;

            if (matchesSearch && matchesCategory) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }
    if (filterSelect) {
        filterSelect.addEventListener('change', applyFilters);
    }


    console.log("The Living Archive Script v2.0 Loaded.");
});
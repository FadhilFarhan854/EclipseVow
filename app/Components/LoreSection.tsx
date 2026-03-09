"use client";

import { useState } from "react";

const loreChapters = [
  {
    id: 0,
    title: "Prolog",
    subtitle: "\"When the gods fell silent, we learned to speak.\"",
    content: [
      "Dahulu, manusia berdoa.",
      "Setiap pagi mereka menundukkan kepala kepada para dewa. Memohon panen yang baik. Memohon keselamatan. Memohon agar penderitaan mereka didengar.",
      "Dan selama ribuan tahun, dunia percaya bahwa para dewa mendengarkan.",
      "Namun suatu hari, seseorang menemukan sesuatu yang tidak seharusnya ditemukan.",
      "Di sebuah kuil yang terkubur di bawah kota yang telah lama mati, terdapat sebuah prasasti yang lebih tua dari semua kitab suci.",
      "Di atasnya tertulis satu kalimat yang mengubah segalanya:",
      "\"Para dewa tidak menciptakan manusia. Manusia menciptakan para dewa.\""
    ]
  },
  {
    id: 1,
    title: "Kelahiran Sumpah",
    subtitle: "Chapter I",
    content: [
      "Kebenaran itu menyebar seperti racun yang lambat.",
      "Para raja mencoba menguburnya. Para pendeta menyebutnya bid'ah. Kitab-kitab dibakar.",
      "Namun sebagian orang sudah melihat terlalu jauh untuk kembali percaya.",
      "Mereka mulai memperhatikan dunia dengan cara yang berbeda. Mereka melihat bahwa doa tidak selalu dijawab, keajaiban para dewa semakin jarang, kuil-kuil besar semakin sunyi.",
      "Seolah-olah sesuatu sedang memudar.",
      "Akhirnya, sekelompok kecil manusia berkumpul dalam rahasia. Mereka tidak datang sebagai pemberontak. Mereka datang sebagai orang-orang yang pernah percaya. Orang-orang yang pernah berharap.",
      "Di bawah langit tanpa bulan, mereka membuat sebuah sumpah. Bukan sumpah untuk menghancurkan para dewa. Tetapi sumpah untuk mencari kebenaran yang para dewa sembunyikan.",
      "Sumpah itu dikenal sebagai: The Eclipse Vow"
    ]
  },
  {
    id: 2,
    title: "Setelah Sumpah",
    subtitle: "Chapter II",
    content: [
      "Tahun-tahun berlalu.",
      "Mereka yang bersumpah tidak lagi sama seperti sebelumnya. Beberapa kehilangan rumah mereka. Beberapa kehilangan iman mereka. Beberapa kehilangan nama mereka sendiri.",
      "Namun sesuatu yang aneh mulai terjadi.",
      "Ketika mereka berhenti berdoa… keajaiban masih terjadi.",
      "Pedang mereka menjadi lebih tajam dari yang seharusnya. Luka mereka sembuh lebih cepat dari yang masuk akal. Langit kadang meredup ketika mereka berkumpul.",
      "Seolah-olah dunia sendiri mulai mendengarkan mereka.",
      "Bukan para dewa. Tetapi sesuatu yang lebih tua."
    ]
  },
  {
    id: 3,
    title: "Para Pembawa Sumpah",
    subtitle: "Chapter III — Vow Bearer",
    content: [
      "Mereka yang berada dalam Eclipse Vow tidak menyebut diri mereka pahlawan.",
      "Mereka menyebut diri mereka: Vowbearers",
      "Karena sumpah itu bukan hanya kata-kata. Sumpah itu meninggalkan sesuatu di dalam diri mereka. Sebuah bekas yang tidak terlihat. Sebuah bayangan di jiwa mereka.",
      "Ketika dua Vowbearer bertemu, mereka bisa merasakannya. Seperti gema dari sumpah yang sama. Seperti dua api kecil yang berasal dari bara yang sama.",
      "Itulah sebabnya mereka tidak pernah benar-benar sendirian."
    ]
  },
  {
    id: 4,
    title: "Rahasia yang Mulai Terungkap",
    subtitle: "Chapter IV",
    content: [
      "Semakin lama mereka mencari, semakin jelas sebuah pola muncul.",
      "Para dewa memang ada. Namun mereka bukan penguasa dunia. Mereka adalah sesuatu yang lain. Sesuatu yang lahir dari kepercayaan manusia itu sendiri.",
      "Selama manusia percaya, para dewa hidup. Namun ketika iman mulai retak… para dewa mulai takut.",
      "Itulah sebabnya kuil-kuil semakin keras mengutuk mereka. Itulah sebabnya para raja mulai memburu mereka.",
      "Karena jika kebenaran itu menyebar… para dewa mungkin akan lenyap seperti senja yang dilupakan malam."
    ]
  },
  {
    id: 5,
    title: "Ikatan yang Tidak Terlihat",
    subtitle: "Chapter V",
    content: [
      "Ada satu hal yang tidak pernah mereka sadari saat sumpah itu diucapkan.",
      "Sumpah itu mengikat mereka. Bukan hanya secara janji. Tetapi secara keberadaan.",
      "Ketika seorang Vowbearer terluka, yang lain terkadang merasakan sakit yang sama dalam mimpi. Ketika seorang Vowbearer mati, yang lain merasakan dunia menjadi sedikit lebih sunyi.",
      "Seolah-olah sesuatu yang menghubungkan mereka… perlahan berkurang.",
      "Namun tidak ada yang berbicara tentang hal itu. Karena mereka semua memahami satu hal yang sama:",
      "Jika sumpah ini pernah benar-benar selesai… jika hari ketika para dewa akhirnya jatuh benar-benar tiba… maka dunia tidak akan kembali seperti sebelumnya.",
      "Dan mungkin… mereka juga tidak akan tetap menjadi manusia."
    ]
  },
  {
    id: 6,
    title: "Bisikan Terakhir",
    subtitle: "Chapter VI — Epilog",
    content: [
      "Beberapa Vowbearer mulai mengatakan bahwa mereka mendengar sesuatu dalam mimpi mereka.",
      "Bukan suara para dewa. Bukan doa manusia. Tetapi sesuatu yang berbicara dari balik langit yang gelap.",
      "Sesuatu yang berkata:",
      "\"Ketika gerhana akhirnya datang, kalian akan mengerti siapa yang benar-benar kalian bebaskan.\"",
      "Dan untuk pertama kalinya sejak sumpah itu dibuat… bahkan mereka yang paling berani mulai bertanya pada diri mereka sendiri:",
      "Apakah mereka sedang menyelamatkan dunia… atau hanya membuka pintu bagi sesuatu yang jauh lebih tua dari para dewa."
    ]
  }
];

const LoreSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % loreChapters.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + loreChapters.length) % loreChapters.length);
  };

  const currentChapter = loreChapters[currentIndex];

  return (
    <section className="py-24 px-4 relative">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl text-center text-glow text-primary mb-4 tracking-wider">
          The Chronicle of Eclipse Vow
        </h2>
        <div className="divider-glow w-64 mx-auto mb-12" />

        {/* Card Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-card border border-border flex items-center justify-center text-primary hover:bg-primary hover:text-background transition-all duration-300 box-glow-hover"
            aria-label="Previous chapter"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-card border border-border flex items-center justify-center text-primary hover:bg-primary hover:text-background transition-all duration-300 box-glow-hover"
            aria-label="Next chapter"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Lore Card */}
          <div className="bg-parchment border border-border rounded-lg p-8 md:p-12 relative overflow-hidden min-h-[400px] md:min-h-[500px]">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-primary/30" />
            <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-primary/30" />
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b border-l border-primary/30" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-primary/30" />

            {/* Chapter Header */}
            <div className="text-center mb-8">
              <p className="text-primary/60 text-sm font-body tracking-wider mb-2">
                {currentChapter.subtitle}
              </p>
              <h3 className="font-display text-2xl md:text-3xl text-primary text-glow tracking-wider">
                {currentChapter.title}
              </h3>
            </div>

            {/* Chapter Content */}
            <div className="space-y-4 text-parchment-foreground font-body text-base md:text-lg leading-relaxed">
              {currentChapter.content.map((paragraph, index) => (
                <p 
                  key={index} 
                  className={paragraph.startsWith('"') ? "italic text-primary/80 text-center" : ""}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {loreChapters.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-primary w-6 box-glow"
                  : "bg-muted hover:bg-primary/50"
              }`}
              aria-label={`Go to chapter ${index + 1}`}
            />
          ))}
        </div>

        {/* Chapter indicator */}
        <p className="text-center text-muted-foreground text-sm mt-4 font-body">
          {currentIndex + 1} / {loreChapters.length}
        </p>
      </div>
    </section>
  );
};

export default LoreSection;

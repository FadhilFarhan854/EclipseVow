"use client";

import { Info, AlertCircle, Sword, Shield, Map, FastForward, CheckCircle, Flame } from "lucide-react";

export default function GuideContent() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl font-body">
      <div className="space-y-16">
        {/* BAB 1 */}
        <section className="bg-card/50 border border-border/50 rounded-2xl p-6 md:p-10 backdrop-blur-sm shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

          <h2 className="font-display text-3xl md:text-4xl text-primary mb-8 tracking-wider text-glow flex items-center gap-3">
            <Sword className="text-primary w-8 h-8" />
            BAB 1: Dasar Game
          </h2>

          <div className="space-y-10 text-foreground/80 leading-relaxed">
            {/* 1. Level */}
            <div>
              <h3 className="font-display text-xl text-primary/90 mb-3 flex items-center gap-2">
                <span className="text-primary font-bold">1.</span> Level
              </h3>
              <p className="mb-3">
                Level di Toram sangat penting untuk early game karena semakin tinggi level semakin banyak konten yang dibuka. Konten yang terbuka:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-foreground/70 mb-3">
                <li><strong className="text-foreground/90">Skill Tree</strong> (Penting)</li>
                <li><strong className="text-foreground/90">Craft Item</strong> di pandai besi / blacksmith (semakin tinggi lvl semakin bagus eq yg bisa di craft)</li>
                <li><strong className="text-foreground/90">Stat poin</strong> semakin tinggi semakin banyak poin stat yang bisa dipasang (dapat bonus dari achievement ketika sampai di level tertentu)</li>
              </ul>
              <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-lg mt-4 text-sm text-primary/80 flex items-start gap-3 shadow-inner">
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>
                  Ada 2 cara untuk boost level, untuk saat ini yang paling cepat adalah menyelesaikan main quest.
                  Pada saat guide ini dibuat (30/03/2026), ketika menyelesaikan main quest dari level 0, kamu akan selesai di <strong className="text-primary font-bold">level 260</strong>.
                </p>
              </div>
            </div>

            {/* 2. Job */}
            <div>
              <h3 className="font-display text-xl text-primary/90 mb-4 flex items-center gap-2">
                <span className="text-primary font-bold">2.</span> Job
              </h3>
              <p className="mb-4">
                Job di Toram tidak di-lock secara otomatis oleh sistem, game ini bebas kalian mau jadi apapun.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <div className="bg-black/20 border border-primary/20 p-3 rounded-lg flex items-center gap-2 shadow-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Pakai magic dmg untuk pedang? <strong className="text-emerald-400">Bisa</strong></span>
                </div>
                <div className="bg-black/20 border border-primary/20 p-3 rounded-lg flex items-center gap-2 shadow-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Pakai katana untuk full damage? <strong className="text-emerald-400">Bisa</strong></span>
                </div>
                <div className="bg-black/20 border border-primary/20 p-3 rounded-lg flex items-center gap-2 shadow-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Pakai katana tapi ingin lincah? <strong className="text-emerald-400">Bisa juga</strong></span>
                </div>
                <div className="bg-black/20 border border-primary/20 p-3 rounded-lg flex items-center gap-2 shadow-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Ingin jadi tank tapi pakai tongkat mage? <strong className="text-emerald-400">Bisa</strong></span>
                </div>
                <div className="bg-black/20 border border-primary/20 p-3 rounded-lg flex items-center gap-2 sm:col-span-2 shadow-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Atau bahkan ingin jadi pedagang yang tidak fokus kombat/bossing? <strong className="text-emerald-400">Bisa juga</strong></span>
                </div>
              </div>
              <p className="text-primary/70 italic text-center text-lg mt-4 font-display bg-primary/5 p-4 rounded-xl border border-primary/10">
                &quot;Konsep game ini adalah kebebasan, selagi masih pemula explore aja playstyle yang nyaman.&quot;
              </p>
            </div>

            {/* 3. Skill */}
            <div>
              <h3 className="font-display text-xl text-primary/90 mb-3 flex items-center gap-2">
                <span className="text-primary font-bold">3.</span> Skill
              </h3>
              <p className="mb-3">
                Skill di Toram penting banget soalnya ini merupakan mekanik utama dari gamenya, karena itu disarankan untuk capai level 240 secepatnya di salah satu karakter untuk membuka semua skill di semua karakter.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-foreground/70 bg-black/10 p-5 rounded-lg border border-border/30">
                <li>Skill memiliki tingkatan tertentu.</li>
                <li>Dari skill tree <strong className="text-foreground/90">Lv 1</strong> (kebuka di early game) sampai skill tree <strong className="text-foreground/90">Lv 5</strong> di level 240.</li>
                <li>Build skill menyesuaikan dengan job yang ingin dibuat, bisa tanya sepuh atau cari di YouTube.</li>
              </ul>
            </div>

            {/* 4. Stat */}
            <div>
              <h3 className="font-display text-xl text-primary/90 mb-4 flex items-center gap-2">
                <span className="text-primary font-bold">4.</span> Stat
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card/50 p-6 rounded-xl border border-border/40 shadow-md">
                  <h4 className="font-bold text-primary mb-4 text-lg border-b border-primary/20 pb-2">Stat Utama (Ada 6)</h4>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-2"><span className="text-primary/90 font-bold w-10">STR</span> <span className="text-foreground/70">(Strength)</span></li>
                    <li className="flex items-center gap-2"><span className="text-primary/90 font-bold w-10">INT</span> <span className="text-foreground/70">(Intelligence)</span></li>
                    <li className="flex items-center gap-2"><span className="text-primary/90 font-bold w-10">VIT</span> <span className="text-foreground/70">(Vitality)</span></li>
                    <li className="flex items-center gap-2"><span className="text-primary/90 font-bold w-10">AGI</span> <span className="text-foreground/70">(Agility)</span></li>
                    <li className="flex items-center gap-2"><span className="text-primary/90 font-bold w-10">DEX</span> <span className="text-foreground/70">(Dexterity)</span></li>
                  </ul>
                </div>
                <div className="bg-card/50 p-6 rounded-xl border border-border/40 shadow-md">
                  <h4 className="font-bold text-primary mb-4 text-lg border-b border-primary/20 pb-2">Stat Pendukung (Personal)</h4>
                  <ul className="space-y-3 text-sm">
                    <li className="flex gap-2"><span className="text-primary/90 font-bold w-10 flex-shrink-0">TEC</span> <span className="text-foreground/70">(Technic untuk char blacksmith)</span></li>
                    <li className="flex gap-2"><span className="text-primary/90 font-bold w-10 flex-shrink-0">CRT</span> <span className="text-foreground/70">(Critical - jarang dipakai)</span></li>
                    <li className="flex gap-2"><span className="text-primary/90 font-bold w-10 flex-shrink-0">MTL</span> <span className="text-foreground/70">(Mental untuk penahan ailment spt stun)</span></li>
                    <li className="flex gap-2"><span className="text-primary/90 font-bold w-10 flex-shrink-0">LUK</span> <span className="text-foreground/70">(Luck menambah drop/keberuntungan)</span></li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 p-5 bg-black/30 rounded-lg border border-primary/10">
                <p className="text-sm text-foreground/80 mb-3 font-bold border-b border-border/30 pb-2">Normalnya untuk char DPS/Tank menggunakan <strong className="text-primary/90">2 stat utama</strong> semisal:</p>
                <ul className="list-disc list-inside text-sm text-foreground/70 space-y-2 ml-2">
                  <li>Katana: <strong className="text-foreground/90">DEX</strong> dan <strong className="text-foreground/90">STR</strong> atau <strong className="text-foreground/90">AGI</strong> dan DEX/STR</li>
                  <li>Mage: <strong className="text-foreground/90">INT</strong> dan DEX/STR</li>
                  <li>THS/Greatsword: <strong className="text-foreground/90">STR</strong>, <strong className="text-foreground/90">DEX</strong>, CRT</li>
                  <li>Dan lain-lain tergantung kebutuhan kalian.</li>
                </ul>
              </div>
            </div>

            {/* 5. Equipment */}
            <div>
              <h3 className="font-display text-xl text-primary/90 mb-4 flex items-center gap-2">
                <span className="text-primary font-bold">5.</span> Equipment
              </h3>
              <p className="mb-3">Equipment di Toram ada 5 macam:</p>
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary/90 shadow-sm">Senjata utama (Main hand)</span>
                <span className="px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary/90 shadow-sm">Senjata tambahan (Sub hand)</span>
                <span className="px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary/90 shadow-sm">Armor</span>
                <span className="px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary/90 shadow-sm">Alat tambahan (Additional/Add)</span>
                <span className="px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary/90 shadow-sm">Cincin (Ring)</span>
              </div>
              <p className="mb-3">
                Equipment bisa didapatkan dari drop monster atau craft di pandai besi. Equipment statnya bisa di custom oleh player sendiri sesuai kebutuhan. Seperti yang dibilang diawal tadi bahwa konsep game ini adalah kebebasan. Mau bikin eq dengan stat full minus pun bisa (walau ga guna juga sih).
              </p>
              <p className="mb-5">
                Equipment buatan player bisa dibeli di papan kota (Setiap kota punya Papan Konsinyasi / Consignment Board).
              </p>

              <div className="bg-red-950/20 border border-red-500/30 p-4 rounded-lg flex items-start gap-4 shadow-sm">
                <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-200/80 leading-relaxed">
                  <strong className="text-red-400">Note:</strong> Jika kalian ingin membeli equipment dari papan atau player, pastikan tanya ke orang yang paham terlebih dahulu untuk menghindari scam atau pemborosan spina.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BAB 2 */}
        <section className="bg-card/50 border border-border/50 rounded-2xl p-6 md:p-10 backdrop-blur-sm shadow-xl relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <h2 className="font-display text-3xl md:text-4xl text-primary mb-8 tracking-wider text-glow flex items-center gap-3">
            <Map className="text-primary w-8 h-8" />
            BAB 2: Main Quest (MQ)
          </h2>

          <p className="text-foreground/80 mb-10 p-5 bg-primary/5 border border-primary/20 rounded-lg shadow-sm text-lg italic font-display">
            Main quest ini penting untuk boost level dan membuka konten di toram, tapi difficulty-nya nggak ngotak. Kebanyakan player baru kebantai boss di sini.
          </p>

          <div className="space-y-14 text-foreground/80 leading-relaxed">

            {/* 1. Navigasi Quest */}
            <div>
              <h3 className="font-display text-xl text-primary/90 mb-3 flex items-center gap-2">
                <span className="text-primary font-bold">1.</span> Navigasi Quest
              </h3>
              <div className="mb-10 text-foreground/70 bg-black/20 p-6 rounded-xl border border-border/30 shadow-inner">
                <p className="mb-4">
                  Kalo kalian bingung mapnya kemana atau cari NPC-nya di mana, kalian bisa search map dengan quest aktif di global map.
                </p>
                <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-lg mb-6 text-sm text-primary/80 flex items-start gap-3 shadow-sm">
                  <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p>Map lain akan menjadi gelap kecuali map dengan quest yang sedang aktif.</p>
                </div>
                {/* video component */}
                <div className="w-full max-w-2xl mx-auto rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-primary/20 bg-black/40 mb-6">
                  <video
                    src="/asset/mq-navigation.mp4"
                    controls
                    className="w-full h-full object-cover"
                    poster="/asset/eclipse-moon.jpg"
                  />
                </div>
                <div className="border-t border-border/30 pt-5 mt-5">
                  <p className="mb-3 font-semibold text-primary/90 text-lg">Jika berada di map yang sama tapi tidak menemukan yang dicari:</p>
                  <ul className="list-disc list-inside ml-2 space-y-2 mb-6 text-[15px]">
                    <li>Ikuti tanda seru (!).</li>
                    <li>Ikuti tanda tanya (?).</li>
                    <li>Atau explore sampai bagian terdalam di map. Biasnaya boss berada di map bagian terdalam.</li>
                  </ul>
                  <div className="bg-card/60 p-5 rounded-xl border border-border/50 text-[15px] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                    <p className="font-bold text-primary/90 mb-3 text-lg">Misal Map: Distrik Terbengkalai</p>
                    <p className="text-foreground/70 mb-3">Di dalamnya terdapat:</p>
                    <ul className="list-decimal list-inside ml-2 space-y-2 text-foreground/80 font-medium">
                      <li>Distrik Terbengkalai: Area 1 <span className="text-xs text-primary/70 italic font-normal">(hanya 1 yang terlihat di global map)</span></li>
                      <li>Distrik Terbengkalai: Area 2</li>
                      <li>Distrik Terbengkalai: Area 3</li>
                      <li className="text-red-400">Distrik Terbengkalai: Bagian Dalam <span className="text-xs font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded ml-1">🔥 Boss ada disini</span></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Bodyguard */}
            <div>
              <h3 className="font-display text-xl text-primary/90 mb-3 flex items-center gap-2">
                <span className="text-primary font-bold">2.</span> Gunakan Bodyguard
              </h3>
              <p className="mb-5 text-foreground/70">
                Gunakan Bodyguard dari teman atau guild. Berikut cara memanggil bodyguard:
              </p>
              {/* video component */}
              <div className="w-full max-w-2xl mx-auto rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-primary/20 bg-black/40 mb-2">
                <video
                  src="/asset/bodyguard.mp4"
                  controls
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* 3. Difficulty Easy */}
            <div>
              <h3 className="font-display text-xl text-primary/90 mb-3 flex items-center gap-2">
                <span className="text-primary font-bold">3.</span> Pindah Difficulty ke Easy
              </h3>
              <p className="mb-5 text-foreground/70">
                Selalu masuk ke difficulty easy bukan normal, berikut adalah cara untuk pindah difficulty:
              </p>
              {/* video component */}
              <div className="w-full max-w-2xl mx-auto rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-primary/20 bg-black/40 mb-2">
                <video
                  src="/asset/easy.mp4"
                  controls
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* 4. Teleport */}
            <div>
              <h3 className="font-display text-xl text-primary/90 mb-3 flex items-center gap-2">
                <span className="text-primary font-bold">4.</span> Menggunakan Teleport
              </h3>
              <div className="mb-6 space-y-3 text-foreground/70 bg-black/20 p-5 rounded-lg border border-border/30">
                <p>
                  Gunakan teleport ticket atau savepoint untuk mempercepat travel.
                </p>
                <ul className="list-disc list-inside ml-2">
                  <li>Untuk teleport ke kota, kamu bisa membuang sedikit spina.</li>
                  <li>Jika teleport di luar kota harus pakai teleport ticket (kecuali beberapa tempat).</li>
                </ul>
                <p className="mt-2 text-primary/80">
                  Item teleport yang wajib dibeli adalah <strong className="text-primary">Naiata</strong>, karena pada Bab 3 kamu akan jadi babu Naiata dan disuruh mondar-mandir (itemnya bisa dibeli di papan atau minta sepuh).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                <div>
                  <h4 className="font-bold text-primary/80 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                    <Map className="w-4 h-4" /> Teleport di Kota
                  </h4>
                  <div className="w-full rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-primary/20 bg-black/40">
                    <video src="/asset/city-tp.mp4" controls className="w-full h-full object-cover" />
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-primary/80 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                    <Map className="w-4 h-4" /> Teleport di Luar Kota
                  </h4>
                  <div className="w-full rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-primary/20 bg-black/40">
                    <video src="/asset/random-tp.mp4" controls className="w-full h-full object-cover" />
                  </div>
                </div>

                <div className="md:col-span-2 w-full max-w-2xl mx-auto mt-4">
                  <h4 className="font-bold text-primary/80 mb-3 flex items-center justify-center gap-2 text-sm uppercase tracking-wide text-center">
                    <Map className="w-4 h-4" /> Teleport Point (Naiata)
                  </h4>
                  <div className="w-full rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-primary/20 bg-black/40">
                    <video src="/asset/naiata-tp.mp4" controls className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Skip Cutscene */}
            <div>
              <h3 className="font-display text-xl text-primary/90 mb-3 flex items-center gap-2">
                <span className="text-primary font-bold">5.</span> Skip Cutscene
              </h3>
              <p className="mb-5 text-foreground/70">
                Jika ingin lebih cepat, kalian bisa skip tiap cutscene karena cutscene ini agak lama dan nggak terlalu penting (kecuali pengen nikmati story-nya).
              </p>
              <div className="w-full max-w-2xl mx-auto rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-primary/20 bg-black/40 mb-2">
                <video src="/asset/skip-cutscene.mp4" controls className="w-full h-full object-cover" />
              </div>
            </div>

            {/* 6. Buff Makanan */}
            <div>
              <h3 className="font-display text-xl text-primary/90 mb-3 flex items-center gap-2">
                <span className="text-primary font-bold">6.</span> Selalu Gunakan Buff Makanan!
              </h3>
              <p className="mb-5 text-foreground/70">
                Kalian bisa mengunjungi rumah/land orang untuk mendapat makanan yang akan memberikan buff.
              </p>
              <div className="w-full max-w-2xl mx-auto rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-primary/20 bg-black/40 mb-8">
                <video src="/asset/buff.mp4" controls className="w-full h-full object-cover" />
              </div>

              <div className="bg-card/40 p-6 rounded-xl border border-border/50 shadow-inner">
                <p className="mb-4 text-sm text-center italic text-foreground/60">
                  Untuk kode rumah yang ada buff-nya, kalian bisa tanya ke sepuh atau lihat di Discord Guild.
                </p>
                <div className="space-y-4">
                  <h4 className="font-display text-primary text-lg text-center tracking-wide border-b border-border/50 pb-3">Rekomendasi Kode Buff:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-blue-900/10 border border-blue-500/20 p-4 rounded-xl flex flex-col items-center text-center shadow">
                      <span className="text-blue-400 font-bold mb-2 text-lg">Max MP</span>
                      <span className="font-mono text-sm text-blue-200/70">2011234<br />1010017<br />3017676</span>
                    </div>
                    <div className="bg-yellow-900/10 border border-yellow-500/20 p-4 rounded-xl flex flex-col items-center text-center shadow">
                      <span className="text-yellow-400 font-bold mb-2 text-lg">AMPR</span>
                      <span className="font-mono text-sm text-yellow-200/70">4040404<br />1010017<br />2011234</span>
                    </div>
                    <div className="bg-red-900/10 border border-red-500/20 p-4 rounded-xl flex flex-col items-center text-center shadow">
                      <span className="text-red-400 font-bold mb-2 text-lg">Crit Rate</span>
                      <span className="font-mono text-sm text-red-200/70">1100000<br />-<br />-</span>
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex items-center justify-center gap-3 text-sm text-primary/90 bg-primary/10 p-4 rounded-lg border border-primary/20">
                  <Flame className="w-5 h-5 text-orange-400 animate-pulse" />
                  <p>Maksimal kalian bisa makan <strong>4 buff orang</strong> dan <strong>1 buff masakan sendiri</strong> (Total 5 Buff).</p>
                </div>
              </div>
            </div>

            {/* 7. Panggil Teman */}
            <div>
              <h3 className="font-display text-xl text-primary/90 mb-4 flex items-center gap-2">
                <span className="text-primary font-bold">7.</span> Bantuan Ekstra
              </h3>
              <div className="bg-primary/5 border border-primary/20 p-8 rounded-2xl text-center shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
                <Shield className="w-12 h-12 text-primary/60 mx-auto mb-4" />
                <p className="text-foreground/80 mb-4 text-lg">
                  Jika ada boss yang terlalu susah ditaklukkan meskipun sudah di-easy, jangan ragu untuk <strong className="text-primary">memanggil teman atau anggota guild</strong>.
                </p>
                <div className="divider-glow w-32 mx-auto mb-4" />
                <p className="text-primary font-display text-xl md:text-2xl mt-4 italic text-glow-strong">
                  &quot;Jika mengikuti tips ini, bagi pemula bisa menamatkan MQ dalam waktu seminggu, bahkan dengan equipment pemula atau tanpa equipment sekalipun &quot;
                </p>
              </div>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}

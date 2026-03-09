const GuildFooter = () => {
  return (
    <footer className="border-t border-border py-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h3 className="font-display text-lg tracking-wider text-primary/60 mb-4">
          Eclipse Vow
        </h3>

        <div className="flex justify-center gap-6 mb-8">
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm font-body">
            Discord
          </a>
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm font-body">
            Twitter
          </a>
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm font-body">
            YouTube
          </a>
        </div>

        <p className="font-body text-sm text-muted-foreground italic">
          &quot;Even in darkness, the vow remains.&quot;
        </p>
      </div>
    </footer>
  );
};

export default GuildFooter;

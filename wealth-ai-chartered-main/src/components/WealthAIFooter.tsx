export const WealthAIFooter = () => {
  return (
    <footer className="border-t bg-card/30 backdrop-blur-sm">
      {/* Professional Disclaimer */}
      <div className="disclaimer-card mx-6 my-4">
        <p className="font-medium mb-1">⚖️ Professional Advisory Notice</p>
        <p className="text-xs">
          This is AI-assisted financial guidance, not a substitute for professional advice. 
          Please consult your CA before making investment decisions or filing returns.
        </p>
      </div>
      
      <div className="text-center py-4 border-t bg-muted/20">
        <p className="text-sm text-muted-foreground">
          © 2024 Wealth AI. Professional AI-powered financial guidance.
        </p>
      </div>
    </footer>
  );
};
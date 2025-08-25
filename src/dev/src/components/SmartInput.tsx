import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  HiSparkles,
  HiLightBulb,
  HiMicrophone,
  HiStop,
  HiArrowRight,
  HiCheck,
  HiX
} from 'react-icons/hi2';

interface SmartSuggestion {
  id: string;
  text: string;
  category: 'template' | 'feature' | 'tech' | 'completion';
  confidence: number;
  icon?: string;
}

interface SmartInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSuggestionSelect?: (suggestion: SmartSuggestion) => void;
  context?: 'simple' | 'advanced' | 'expert';
  className?: string;
}

const SmartInput: React.FC<SmartInputProps> = ({
  value,
  onChange,
  placeholder = "Beskriv prosjektet ditt...",
  onSuggestionSelect,
  context = 'simple',
  className = ""
}) => {
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [isListening, setIsListening] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [enhancedSuggestions, setEnhancedSuggestions] = useState<string[]>([]);
  
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'nb-NO';
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onChange(value + ' ' + transcript);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Generate suggestions based on input
  const generateSuggestions = useCallback(async (input: string) => {
    if (input.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newSuggestions: SmartSuggestion[] = [];
    const words = input.toLowerCase().split(/\s+/);
    const lastWord = words[words.length - 1];
    
    // Template suggestions
    if (input.length < 20) {
      const templates = [
        { id: 'todo', text: 'en moderne todo-app med drag-and-drop funksjonalitet', icon: '✅' },
        { id: 'ecommerce', text: 'en e-commerce platform med handlekurv og betalingsintegrasjon', icon: '🛒' },
        { id: 'blog', text: 'en blog-plattform med markdown-støtte og kommentarsystem', icon: '📝' },
        { id: 'chat', text: 'en sanntids chat-applikasjon med fildelingsegenskaper', icon: '💬' },
        { id: 'dashboard', text: 'et analytics dashboard med interaktive grafer og rapporter', icon: '📊' },
        { id: 'portfolio', text: 'en profesjonell portfolio-nettside med prosjektgalleri', icon: '🎨' }
      ];
      
      templates
        .filter(template => 
          words.some(word => template.text.includes(word)) ||
          template.id.includes(lastWord)
        )
        .forEach(template => {
          newSuggestions.push({
            id: template.id,
            text: template.text,
            category: 'template',
            confidence: 0.9,
            icon: template.icon
          });
        });
    }

    // Feature suggestions based on context
    const features = getContextualFeatures(input);
    features.forEach(feature => {
      newSuggestions.push({
        id: `feature-${feature.name}`,
        text: `med ${feature.name}`,
        category: 'feature',
        confidence: feature.relevance,
        icon: feature.icon
      });
    });

    // Technology stack suggestions
    if (context !== 'simple') {
      const techStacks = getTechStackSuggestions(input);
      techStacks.forEach(tech => {
        newSuggestions.push({
          id: `tech-${tech.name}`,
          text: `bygget med ${tech.name}`,
          category: 'tech',
          confidence: tech.relevance,
          icon: '⚡'
        });
      });
    }

    // Auto-completion for common phrases
    const completions = getAutoCompletions(input);
    completions.forEach(completion => {
      newSuggestions.push({
        id: `completion-${completion}`,
        text: completion,
        category: 'completion',
        confidence: 0.7
      });
    });

    // Enhanced AI suggestions
    const enhanced = await getEnhancedSuggestions(input);
    enhanced.forEach(suggestion => {
      newSuggestions.push({
        id: `enhanced-${suggestion}`,
        text: suggestion,
        category: 'completion',
        confidence: 0.8,
        icon: '✨'
      });
    });

    // Sort by confidence and limit results
    const sortedSuggestions = newSuggestions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 8);

    setSuggestions(sortedSuggestions);
    setIsAnalyzing(false);
  }, [context]);

  const getContextualFeatures = (input: string): any[] => {
    const features = [
      { name: 'autentisering', keywords: ['login', 'bruker', 'konto'], icon: '🔐', relevance: 0.8 },
      { name: 'database', keywords: ['data', 'lagring', 'innhold'], icon: '🗄️', relevance: 0.7 },
      { name: 'sanntid', keywords: ['live', 'chat', 'oppdatering'], icon: '⚡', relevance: 0.9 },
      { name: 'responsive design', keywords: ['mobil', 'tablet', 'responsiv'], icon: '📱', relevance: 0.6 },
      { name: 'dark mode', keywords: ['mørk', 'tema', 'theme'], icon: '🌙', relevance: 0.5 },
      { name: 'søkefunksjonalitet', keywords: ['søk', 'filter', 'finn'], icon: '🔍', relevance: 0.7 },
      { name: 'notifikasjoner', keywords: ['varsling', 'notification', 'alert'], icon: '🔔', relevance: 0.6 },
      { name: 'filupplasting', keywords: ['fil', 'upload', 'bilde'], icon: '📎', relevance: 0.8 }
    ];

    return features.filter(feature => 
      feature.keywords.some(keyword => 
        input.toLowerCase().includes(keyword)
      )
    );
  };

  const getTechStackSuggestions = (input: string): any[] => {
    const techStacks = [
      { name: 'React + TypeScript', keywords: ['react', 'typescript', 'modern'], relevance: 0.9 },
      { name: 'Next.js', keywords: ['ssr', 'seo', 'performance'], relevance: 0.8 },
      { name: 'Vue.js', keywords: ['vue', 'lightweight', 'simple'], relevance: 0.7 },
      { name: 'Svelte', keywords: ['fast', 'minimal', 'performance'], relevance: 0.6 },
      { name: 'Node.js + Express', keywords: ['api', 'server', 'backend'], relevance: 0.8 },
      { name: 'Firebase', keywords: ['database', 'auth', 'realtime'], relevance: 0.7 },
      { name: 'Prisma + PostgreSQL', keywords: ['database', 'sql', 'robust'], relevance: 0.8 }
    ];

    return techStacks.filter(stack =>
      stack.keywords.some(keyword => 
        input.toLowerCase().includes(keyword)
      )
    );
  };

  const getAutoCompletions = (input: string): string[] => {
    const completions = [
      'med moderne UI og UX design',
      'som er responsive for alle enheter',
      'med innebygd søkefunksjonalitet',
      'som støtter flere språk',
      'med automatisk backup system',
      'som har offline-støtte',
      'med avanserte sikkerhetsfeatures',
      'som integrerer med populære tjenester'
    ];

    return completions.filter(completion =>
      !input.toLowerCase().includes(completion.toLowerCase().substring(0, 10))
    ).slice(0, 3);
  };

  const getEnhancedSuggestions = async (input: string): Promise<string[]> => {
    // Simulate AI enhancement analysis
    const enhancements = [
      'Jeg vil også ha en admin-panel for administrasjon',
      'Prosjektet skal ha god SEO og være søkemotoroptimalisert',  
      'Det må støtte flere betalingsmetoder som Stripe og PayPal',
      'Systemet trenger automatiske e-postvarslinger til brukere',
      'Applikasjonen skal ha avanserte analytics og rapporter',
      'Det må være integrert med sosiale medier for deling'
    ];

    const relevantEnhancements = enhancements.filter(() => Math.random() > 0.7);
    return relevantEnhancements.slice(0, 2);
  };

  // Handle input changes with debouncing
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      generateSuggestions(value);
    }, 500);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [value, generateSuggestions]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        if (selectedSuggestionIndex >= 0) {
          e.preventDefault();
          handleSuggestionSelect(suggestions[selectedSuggestionIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  const handleSuggestionSelect = (suggestion: SmartSuggestion) => {
    if (suggestion.category === 'completion') {
      onChange(value + ' ' + suggestion.text);
    } else {
      onChange(suggestion.text);
    }
    
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
    onSuggestionSelect?.(suggestion);
    inputRef.current?.focus();
  };

  const startVoiceInput = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const enhanceInput = async () => {
    if (!value.trim()) return;

    setIsAnalyzing(true);
    
    // Simulate AI enhancement
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const enhanced = `${value} med moderne design, responsive layout, og optimalisert for beste brukeropplevelse`;
    onChange(enhanced);
    setIsAnalyzing(false);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <textarea
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => {
            // Delay hiding to allow suggestion clicks
            setTimeout(() => setShowSuggestions(false), 200);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={4}
          className={`w-full p-4 border-2 rounded-xl resize-none transition-all duration-200 ${
            showSuggestions 
              ? 'border-blue-500 shadow-lg' 
              : 'border-gray-200 focus:border-blue-300'
          } ${isAnalyzing ? 'bg-blue-50' : 'bg-white'}`}
          style={{ fontFamily: 'inherit' }}
        />

        {/* Input Enhancement Tools */}
        <div className="absolute right-3 top-3 flex gap-2">
          {recognitionRef.current && (
            <button
              onClick={isListening ? stopVoiceInput : startVoiceInput}
              className={`p-2 rounded-lg transition-all ${
                isListening 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              title="Stemmeinndata"
            >
              {isListening ? <HiStop className="w-4 h-4" /> : <HiMicrophone className="w-4 h-4" />}
            </button>
          )}
          
          <button
            onClick={enhanceInput}
            disabled={!value.trim() || isAnalyzing}
            className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 disabled:opacity-50 transition-all"
            title="Forbedre med AI"
          >
            {isAnalyzing ? (
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <HiSparkles className="w-4 h-4 text-blue-600" />
            )}
          </button>
        </div>

        {/* Character count and analysis status */}
        <div className="absolute bottom-3 left-4 flex items-center gap-3 text-sm text-gray-500">
          <span>{value.length} tegn</span>
          {isAnalyzing && (
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 border border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span>Analyserer...</span>
            </div>
          )}
        </div>
      </div>

      {/* Smart Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto"
        >
          <div className="p-3 border-b bg-gray-50">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <HiLightBulb className="w-4 h-4" />
              AI-forslag
            </div>
          </div>
          
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.id}
              onClick={() => handleSuggestionSelect(suggestion)}
              className={`w-full text-left p-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                index === selectedSuggestionIndex ? 'bg-blue-50 border-blue-200' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                {suggestion.icon && (
                  <span className="text-lg flex-shrink-0 mt-0.5">{suggestion.icon}</span>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {suggestion.text}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      suggestion.category === 'template' 
                        ? 'bg-green-100 text-green-700'
                        : suggestion.category === 'feature'
                        ? 'bg-blue-100 text-blue-700'
                        : suggestion.category === 'tech'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {suggestion.category === 'template' && 'Mal'}
                      {suggestion.category === 'feature' && 'Funksjon'}
                      {suggestion.category === 'tech' && 'Teknologi'}
                      {suggestion.category === 'completion' && 'Fullføring'}
                    </span>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.round(suggestion.confidence * 5) }, (_, i) => (
                        <div key={i} className="w-1 h-1 bg-yellow-400 rounded-full" />
                      ))}
                    </div>
                  </div>
                </div>
                <HiArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SmartInput;
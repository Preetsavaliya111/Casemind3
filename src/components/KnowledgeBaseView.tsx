import React, { useState } from 'react';
import { KnowledgeArticle } from '../types';
import { 
  BookOpen, 
  Search, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  Tag, 
  Clock, 
  User, 
  ExternalLink, 
  X, 
  AlertCircle, 
  Layers, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface KnowledgeBaseViewProps {
  articles: KnowledgeArticle[];
  onIngestArticle: (newArticle: KnowledgeArticle) => void;
  onOpenIncident?: (incidentId: string) => void;
}

export const KnowledgeBaseView: React.FC<KnowledgeBaseViewProps> = ({
  articles,
  onIngestArticle,
  onOpenIncident
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(articles[0] || null);
  
  // Document ingestion state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadStage, setUploadStage] = useState<string>('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  const filteredArticles = articles.filter(art => {
    const matchesCat = selectedCategory === 'ALL' || art.category === selectedCategory;
    const matchesSearch = 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.snippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    // Validate size (max 25MB)
    if (file.size > 25 * 1024 * 1024) {
      setUploadError('File size exceeds the 25MB enterprise ingestion limit.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(15);
    setUploadStage('Reading file stream & validating binary encoding...');

    setTimeout(() => {
      setUploadProgress(45);
      setUploadStage('Semantic chunking & extracting code snippets...');
    }, 500);

    setTimeout(() => {
      setUploadProgress(80);
      setUploadStage('Generating 1,536-dim vector embeddings & linking memory graph...');
    }, 1100);

    setTimeout(() => {
      setUploadProgress(100);
      setUploadStage('Ingestion verified! Added to organizational memory.');

      const newArt: KnowledgeArticle = {
        id: `kb-${Math.floor(500 + Math.random() * 499)}`,
        title: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ").toUpperCase(),
        category: 'RUNBOOK_GUIDE',
        tags: ['Ingested', 'UploadedDoc', 'Tier-3'],
        snippet: `Autonomously parsed ${file.name} (${(file.size / 1024).toFixed(1)} KB). Embedded into CaseMind organizational memory graph.`,
        fullContent: `## Ingested Document: ${file.name}\n\nIngestion timestamp: ${new Date().toISOString()}\nSize: ${file.size} bytes\nFormat: ${file.type || 'text/plain'}\n\n### Parsed Content\nSuccessfully vectorized into CaseMind knowledge index. This document is now available for citation during automated RCA and hypothesis corroboration.`,
        author: 'Elena Rostova (Uploaded)',
        updatedAt: 'Just now',
        relatedIncidents: ['INC-8942'],
        documentType: 'MARKDOWN'
      };

      onIngestArticle(newArt);
      setSelectedArticle(newArt);

      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 1000);
    }, 1700);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="bg-white rounded-xl border border-[#dae2fd] p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-cyan-100 text-[#006077]">
                <BookOpen className="w-5 h-5 text-[#0891b2]" />
              </span>
              <h2 className="text-lg font-bold text-[#131b2e]">
                Organizational Knowledge Base & Document Ingestion
              </h2>
            </div>
            <p className="mt-1 text-xs text-[#464555]">
              Authoritative engineering memory: architecture guides, incident SOPs, runbook specs, and post-mortems indexed for real-time citation.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono bg-[#f2f3ff] px-3 py-1.5 rounded-lg border border-[#dae2fd]">
            <Sparkles className="w-4 h-4 text-[#7c3aed]" />
            <span>Indexed Documents: <strong>{articles.length}</strong></span>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="mt-4 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#777587]" />
            <input
              type="text"
              placeholder="Search knowledge by keyword, architectural pattern, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#f2f3ff] border border-[#c7c4d8] rounded-lg text-xs text-[#131b2e] placeholder-[#777587] focus:ring-2 focus:ring-[#3525cd] focus:bg-white transition-all font-mono"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {['ALL', 'ARCHITECTURAL', 'RUNBOOK_GUIDE', 'REPLICATION', 'INCIDENT_SOP'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 text-xs font-mono rounded-md transition-colors ${
                  selectedCategory === cat 
                    ? 'bg-[#3525cd] text-white shadow-xs' 
                    : 'bg-[#f2f3ff] text-[#464555] hover:bg-[#eaedff]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Articles List & Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Articles List & Ingestion Card */}
        <div className="space-y-4">
          {/* Document Ingestion Box */}
          <div className="bg-[#faf8ff] rounded-xl border border-dashed border-[#76dcff] p-5 text-center space-y-3 relative hover:bg-[#f0fdfa] transition-colors">
            <input
              type="file"
              id="doc-upload"
              onChange={handleFileUpload}
              disabled={isUploading}
              accept=".md,.json,.yaml,.yml,.txt,.log,.pdf"
              className="hidden"
            />
            <label
              htmlFor="doc-upload"
              className="cursor-pointer flex flex-col items-center justify-center space-y-2"
            >
              <div className="w-10 h-10 rounded-full bg-cyan-100 text-[#006077] flex items-center justify-center">
                <UploadCloud className="w-5 h-5 text-[#0891b2]" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#131b2e] hover:text-[#0891b2] transition-colors block">
                  Ingest New Engineering Document
                </span>
                <span className="text-[11px] text-[#464555] block">
                  Click to browse .md, .json, .yaml, or .log files
                </span>
              </div>
            </label>

            {/* Ingestion Progress */}
            {isUploading && (
              <div className="space-y-2 pt-2 border-t border-[#eaedff]">
                <div className="w-full bg-[#eaedff] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#0891b2] h-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-[10px] font-mono text-[#006077] animate-pulse">
                  {uploadStage}
                </p>
              </div>
            )}

            {uploadError && (
              <div className="text-[11px] text-[#ba1a1a] font-mono flex items-center justify-center space-x-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{uploadError}</span>
              </div>
            )}
          </div>

          {/* Articles list */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {filteredArticles.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-xl border border-[#dae2fd]">
                <p className="text-xs text-[#777587]">No articles matched the filter.</p>
              </div>
            ) : (
              filteredArticles.map((art) => {
                const isSelected = selectedArticle?.id === art.id;
                return (
                  <div
                    key={art.id}
                    onClick={() => setSelectedArticle(art)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#0891b2] bg-cyan-50/40 ring-2 ring-[#76dcff]'
                        : 'border-[#dae2fd] bg-white hover:bg-[#faf8ff]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold bg-[#eaedff] text-[#3525cd] px-2 py-0.5 rounded">
                        {art.category}
                      </span>
                      <span className="text-[10px] font-mono text-[#777587]">
                        {art.updatedAt}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-[#131b2e] mt-2 leading-snug">
                      {art.title}
                    </h4>

                    <p className="text-xs text-[#464555] mt-1 line-clamp-2">
                      {art.snippet}
                    </p>

                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {art.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] font-mono bg-[#f2f3ff] text-[#464555] px-1.5 py-0.2 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right 2 columns: Article Reading Pane */}
        <div className="lg:col-span-2">
          {selectedArticle ? (
            <div className="bg-white rounded-xl border border-[#dae2fd] p-6 shadow-xs space-y-5 min-h-[500px]">
              {/* Header */}
              <div className="border-b border-[#eaedff] pb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-100 text-[#006077]">
                      {selectedArticle.category}
                    </span>
                    <span className="text-xs font-mono text-[#777587]">
                      ID: {selectedArticle.id}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#059669] font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Grounded in Vector Memory
                  </span>
                </div>

                <h2 className="text-xl font-bold text-[#131b2e] tracking-tight">
                  {selectedArticle.title}
                </h2>

                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#464555] pt-1">
                  <span>Author: <strong>{selectedArticle.author}</strong></span>
                  <span>Updated: <strong>{selectedArticle.updatedAt}</strong></span>
                  <span>Format: <strong>{selectedArticle.documentType}</strong></span>
                </div>
              </div>

              {/* Related incidents */}
              {selectedArticle.relatedIncidents.length > 0 && (
                <div className="p-3 rounded-lg bg-[#faf8ff] border border-[#eaedff] flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-[#464555] font-mono">
                    Referenced in Incidents:
                  </span>
                  {selectedArticle.relatedIncidents.map(incId => (
                    <button
                      key={incId}
                      onClick={() => onOpenIncident && onOpenIncident(incId)}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-bold bg-[#eaedff] text-[#3525cd] hover:bg-[#dad7ff] transition-colors"
                    >
                      <span>{incId}</span>
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </button>
                  ))}
                </div>
              )}

              {/* Full Content */}
              <div className="prose prose-sm max-w-none text-[#131b2e] leading-relaxed">
                <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] font-sans text-xs whitespace-pre-line leading-relaxed">
                  {selectedArticle.fullContent}
                </div>
              </div>

              {/* Tag footer */}
              <div className="pt-4 border-t border-[#eaedff] flex items-center justify-between text-xs font-mono text-[#464555]">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#777587]" />
                  {selectedArticle.tags.map(tag => (
                    <span key={tag} className="bg-[#f2f3ff] text-[#464555] px-2 py-0.5 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-[#dae2fd] p-12 text-center text-[#777587]">
              Select an article to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

'use client'
import { useEffect, useState } from 'react'
import { Copy, Trash2, Edit3, Check, Save, X, AlertCircle, Moon, Sun } from 'lucide-react'

type Block = {
  id: number
  title: string
  content: string
}

export default function Home() {
  const [blocks, setBlocks] = useState<Block[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [showWarning, setShowWarning] = useState(true)
  
  // State สำหรับ Dark Mode
  const [isDark, setIsDark] = useState(false)
  
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [copiedId, setCopiedId] = useState<number | null>(null)

  // ดึงข้อมูลและตั้งค่า Theme ตอนโหลดเว็บ
  useEffect(() => {
    // โหลด Text Blocks
    const savedBlocks = localStorage.getItem('my-text-blocks')
    if (savedBlocks) setBlocks(JSON.parse(savedBlocks))
    
    // โหลด Theme (ถ้าเคยตั้งค่าไว้เป็น dark หรือระบบของเครื่องเป็น dark)
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    }
    
    setIsLoaded(true)
  }, [])

  // ฟังก์ชันสลับ Dark / Light Mode
  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      setIsDark(false)
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      setIsDark(true)
    }
  }

  const updateBlocksAndSave = (newBlocks: Block[]) => {
    setBlocks(newBlocks)
    localStorage.setItem('my-text-blocks', JSON.stringify(newBlocks))
  }

  function addBlock(e: React.FormEvent) {
    e.preventDefault()
    if (!newContent.trim()) return
    const newBlock: Block = { id: Date.now(), title: newTitle.trim(), content: newContent }
    updateBlocksAndSave([...blocks, newBlock])
    setNewTitle(''); setNewContent('')
  }

  function save(id: number) {
    const updatedBlocks = blocks.map(b => b.id === id ? { ...b, title: editTitle.trim(), content: editContent } : b)
    updateBlocksAndSave(updatedBlocks)
    setEditingId(null)
  }

  function deleteBlock(id: number) {
    if (confirm('Are you sure you want to delete this block?')) {
      updateBlocksAndSave(blocks.filter(b => b.id !== id))
    }
  }

  function handleCopy(id: number, content: string) {
    navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (!isLoaded) return null

  return (
    <div className="max-w-3xl mx-auto py-12">
      
      <div className="bg-[#f0f4f9] dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors duration-300 relative">
        
        <button 
          onClick={toggleTheme}
          className="absolute top-6 right-8 p-2 rounded-full bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95"
          title="Toggle Dark Mode"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">Text Blocks</h1>

        {showWarning && (
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-4 mb-6 flex gap-3 items-start relative shadow-sm transition-colors">
            <AlertCircle className="text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5" size={20} />
            <div className="text-amber-800 dark:text-amber-200 text-sm leading-relaxed pr-6">
              <strong>Important Note:</strong> Your text blocks are saved locally. 
              Do not clear your browser's <strong>site data</strong> or use <strong>Incognito mode</strong>, 
              otherwise your data will be permanently lost!
            </div>
            <button 
              onClick={() => setShowWarning(false)}
              className="absolute top-3 right-3 text-amber-400 dark:text-amber-600 hover:text-amber-600 dark:hover:text-amber-400 p-1.5 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <form onSubmit={addBlock} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm mb-8 flex flex-col gap-3 transition-colors">
          <input
            type="text"
            placeholder="Title (optional)..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full bg-transparent font-bold text-slate-800 dark:text-slate-100 outline-none placeholder:font-normal placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          <div className="flex items-end gap-4">
            <input
              type="text"
              placeholder="Type your content here..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="flex-1 bg-transparent border-b-2 border-slate-200 dark:border-slate-600 py-2 text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!newContent.trim()}
              className="bg-[#4a85f6] hover:bg-blue-600 disabled:bg-blue-300 dark:disabled:bg-blue-900/50 disabled:cursor-not-allowed text-white px-8 py-2.5 rounded-xl font-medium shadow-sm transition-all active:scale-95"
            >
              Add
            </button>
          </div>
        </form>

        <h2 className="text-slate-600 dark:text-slate-400 font-medium mb-4">
          You have <span className="text-blue-500 font-bold">{blocks.length}</span> block(s)
        </h2>

        <div className="space-y-3">
          {blocks.map((b) => (
            <div key={b.id} className="flex items-start sm:items-center justify-between bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 gap-4 group transition-colors">
              <div className="flex items-start sm:items-center gap-4 flex-1 overflow-hidden">
                <button
                  onClick={() => handleCopy(b.id, b.content)}
                  className={`flex-shrink-0 p-1.5 rounded-full transition-colors ${copiedId === b.id ? 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400' : 'bg-slate-100 dark:bg-slate-700/50 text-slate-400 dark:text-slate-500 hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:text-blue-600 dark:hover:text-blue-400'}`}
                >
                  {copiedId === b.id ? <Check size={18} /> : <Copy size={18} />}
                </button>

                <div className="flex-1 min-w-0 pr-4">
                  {editingId === b.id ? (
                    <div className="flex flex-col gap-2">
                      <input
                        type="text"
                        placeholder="Title..."
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 font-bold text-slate-800 dark:text-slate-100 p-2 rounded-lg outline-none border border-blue-200 dark:border-blue-800 focus:border-blue-400 text-sm"
                      />
                      <textarea
                        autoFocus
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 p-2 rounded-lg outline-none border border-blue-200 dark:border-blue-800 focus:border-blue-400 text-sm resize-none"
                        rows={2}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      {b.title && <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-0.5">{b.title}</h3>}
                      <p className="text-slate-700 dark:text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">{b.content}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {editingId === b.id ? (
                  <>
                    <button onClick={() => setEditingId(null)} className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 p-2.5 rounded-xl"><X size={16} /></button>
                    <button onClick={() => save(b.id)} className="bg-green-500 hover:bg-green-600 text-white p-2.5 rounded-xl"><Save size={16} /></button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { setEditingId(b.id); setEditTitle(b.title || ''); setEditContent(b.content); }} className="bg-[#4a85f6] hover:bg-blue-600 text-white p-2.5 rounded-xl"><Edit3 size={16} /></button>
                    <button onClick={() => deleteBlock(b.id)} className="bg-[#ff6b6b] hover:bg-red-500 text-white p-2.5 rounded-xl"><Trash2 size={16} /></button>
                  </>
                )}
              </div>
            </div>
          ))}

          {blocks.length === 0 && (
            <div className="text-center py-12 bg-white/50 dark:bg-slate-800/50 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl transition-colors">
              <p className="text-slate-500 dark:text-slate-400 font-medium">Your list is empty.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
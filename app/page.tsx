'use client'
import { useEffect, useState } from 'react'
import { Copy, Trash2, Edit3, Check, Save, X } from 'lucide-react'

export default function Home() {
  const [blocks, setBlocks] = useState<any[]>([])
  
  // State สำหรับแก้ไข
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  
  // State สำหรับสร้างใหม่
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  
  const [copiedId, setCopiedId] = useState<number | null>(null)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const res = await fetch('/api/blocks')
    const data = await res.json()
    setBlocks(data)
  }

  async function addBlock(e: React.FormEvent) {
    e.preventDefault()
    if (!newContent.trim()) return

    await fetch('/api/blocks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        title: newTitle.trim(), // ส่ง title ไปด้วย
        content: newContent 
      })
    })
    
    // เคลียร์ช่องพิมพ์หลังกด Add
    setNewTitle('')
    setNewContent('')
    load()
  }

  async function save(id: number) {
    await fetch(`/api/blocks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        title: editTitle.trim(), // ส่ง title ไปอัปเดตด้วย
        content: editContent 
      })
    })
    setEditingId(null)
    load()
  }

  async function deleteBlock(id: number) {
    if (confirm('Are you sure you want to delete this block?')) {
      await fetch(`/api/blocks/${id}`, { method: 'DELETE' })
      load()
    }
  }

  function handleCopy(id: number, content: string) {
    navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="max-w-3xl mx-auto py-12">
      
      {/* Main Card Container */}
      <div className="bg-[#f0f4f9] p-8 rounded-3xl shadow-sm border border-slate-200">
        
        {/* Input & Add Button Section */}
        <form onSubmit={addBlock} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mb-8 flex flex-col gap-3">
          {/* ช่องใส่ Title (ตั้งให้เป็นตัวหนา) */}
          <input
            type="text"
            placeholder="Title (optional)..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full bg-transparent font-bold text-slate-800 outline-none placeholder:font-normal placeholder:text-slate-400"
          />
          
          <div className="flex items-end gap-4">
            {/* ช่องใส่ Content */}
            <input
              type="text"
              placeholder="Type your content here..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="flex-1 bg-transparent border-b-2 border-slate-200 py-2 text-slate-700 outline-none focus:border-blue-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!newContent.trim()}
              className="bg-[#4a85f6] hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white px-8 py-2.5 rounded-xl font-medium shadow-sm transition-all active:scale-95"
            >
              Add
            </button>
          </div>
        </form>

        <h2 className="text-slate-600 font-medium mb-4">
          You have <span className="text-blue-500 font-bold">{blocks.length}</span> block(s)
        </h2>

        {/* List of Blocks */}
        <div className="space-y-3">
          {blocks.map((b) => (
            <div
              key={b.id}
              className="flex items-start sm:items-center justify-between bg-white p-3 sm:p-4 rounded-2xl shadow-sm border border-slate-100 gap-4 group"
            >
              
              {/* Left Side: Copy Button + Text */}
              <div className="flex items-start sm:items-center gap-4 flex-1 overflow-hidden">
                {/* Copy Button */}
                <button
                  onClick={() => handleCopy(b.id, b.content)}
                  className={`flex-shrink-0 p-1.5 rounded-full transition-colors ${
                    copiedId === b.id ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400 hover:bg-blue-100 hover:text-blue-600'
                  }`}
                  title="Copy content"
                >
                  {copiedId === b.id ? <Check size={18} /> : <Copy size={18} />}
                </button>

                {/* Content Area */}
                <div className="flex-1 min-w-0 pr-4">
                  {editingId === b.id ? (
                    // โหมดแก้ไข (Edit Mode)
                    <div className="flex flex-col gap-2">
                      <input
                        type="text"
                        placeholder="Title..."
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full bg-slate-50 font-bold text-slate-800 p-2 rounded-lg outline-none border border-blue-200 focus:border-blue-400 text-sm"
                      />
                      <textarea
                        autoFocus
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full bg-slate-50 text-slate-700 p-2 rounded-lg outline-none border border-blue-200 focus:border-blue-400 text-sm resize-none"
                        rows={2}
                      />
                    </div>
                  ) : (
                    // โหมดแสดงผลปกติ
                    <div className="flex flex-col">
                      {/* ถ้ามี Title ให้แสดงบรรทัดนี้ */}
                      {b.title && (
                        <h3 className="font-bold text-slate-800 text-sm mb-0.5">{b.title}</h3>
                      )}
                      <p className="text-slate-700 text-sm whitespace-pre-wrap leading-relaxed">
                        {b.content}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side: Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {editingId === b.id ? (
                  <>
                    <button onClick={() => setEditingId(null)} className="bg-slate-200 hover:bg-slate-300 text-slate-600 p-2.5 rounded-xl transition-colors">
                      <X size={16} />
                    </button>
                    <button onClick={() => save(b.id)} className="bg-green-500 hover:bg-green-600 text-white p-2.5 rounded-xl shadow-sm transition-colors">
                      <Save size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    {/* Edit Button */}
                    <button
                      onClick={() => { 
                        setEditingId(b.id); 
                        setEditTitle(b.title || ''); // ดึง title เดิมมาแสดงตอนกดแก้
                        setEditContent(b.content); 
                      }}
                      className="bg-[#4a85f6] hover:bg-blue-600 text-white p-2.5 rounded-xl shadow-sm transition-transform active:scale-90"
                    >
                      <Edit3 size={16} />
                    </button>
                    
                    {/* Delete Button */}
                    <button
                      onClick={() => deleteBlock(b.id)}
                      className="bg-[#ff6b6b] hover:bg-red-500 text-white p-2.5 rounded-xl shadow-sm transition-transform active:scale-90"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
              </div>

            </div>
          ))}

          {blocks.length === 0 && (
            <div className="text-center py-12 bg-white/50 border-2 border-dashed border-slate-300 rounded-3xl">
              <p className="text-slate-500 font-medium">Your list is empty.</p>
            </div>
          )}
        </div>
        
      </div>
    </div>
  )
}
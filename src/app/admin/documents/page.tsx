"use client"

import { useState } from "react"
import { useAdminStore, DocumentType } from "@/lib/store/useAdminStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Trash2, Plus, GripVertical, FileText, Shield, AlertCircle, Settings } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function DocumentManagement() {
    const { documentTypes, addDocumentType, removeDocumentType, updateDocumentType } = useAdminStore()
    const [newDocName, setNewDocName] = useState("")

    const handleAdd = () => {
        if (!newDocName.trim()) return
        const id = newDocName.toLowerCase().replace(/\s+/g, "_")
        addDocumentType({
            id,
            name: newDocName,
            photoCount: 1,
            isMandatory: true
        })
        setNewDocName("")
    }

    return (
        <div className="space-y-6 sm:space-y-10 pb-20 max-w-[1200px] mx-auto animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Settings className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-3xl sm:text-5xl font-black italic uppercase tracking-tighter text-white">System <span className="text-primary">Protocols</span></h2>
                </div>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] sm:text-xs">Configure identifying credentials required for pilot verification.</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* List of Documents */}
                <div className="lg:col-span-2 space-y-4">
                    <AnimatePresence mode="popLayout">
                        {documentTypes.map((doc, idx) => (
                            <motion.div
                                key={doc.id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <Card className="bg-slate-900/40 border-white/5 rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden group hover:border-white/10 transition-all">
                                    <CardContent className="p-6 sm:p-8 flex items-center gap-6">
                                        <div className="h-12 w-12 bg-slate-950 rounded-2xl flex items-center justify-center border border-white/5 text-slate-700 group-hover:text-primary transition-colors">
                                            <FileText className="h-6 w-6" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-black text-white uppercase italic tracking-tight text-lg truncate">{doc.name}</h3>
                                                {doc.isMandatory && (
                                                    <span className="bg-primary/20 text-primary text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest ring-1 ring-primary/20">
                                                        Mandatory
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap items-center gap-6">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Image Capture:</span>
                                                    <div className="flex items-center bg-slate-950 rounded-lg p-1 border border-white/5">
                                                        <button
                                                            onClick={() => updateDocumentType(doc.id, { photoCount: Math.max(1, doc.photoCount - 1) })}
                                                            className="h-6 w-6 flex items-center justify-center text-slate-500 hover:text-white transition-colors"
                                                        >-</button>
                                                        <span className="w-8 text-center text-xs font-black text-white">{doc.photoCount}</span>
                                                        <button
                                                            onClick={() => updateDocumentType(doc.id, { photoCount: Math.min(5, doc.photoCount + 1) })}
                                                            className="h-6 w-6 flex items-center justify-center text-slate-500 hover:text-white transition-colors"
                                                        >+</button>
                                                    </div>
                                                </div>
                                                <label className="flex items-center gap-3 cursor-pointer group/label">
                                                    <div className={`h-5 w-5 rounded-md border-2 transition-all flex items-center justify-center ${doc.isMandatory ? 'border-primary bg-primary' : 'border-slate-800 bg-slate-950'}`}>
                                                        {doc.isMandatory && <Shield className="h-3 w-3 text-black" />}
                                                    </div>
                                                    <input
                                                        type="checkbox"
                                                        className="hidden"
                                                        checked={doc.isMandatory}
                                                        onChange={(e) => updateDocumentType(doc.id, { isMandatory: e.target.checked })}
                                                    />
                                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest group-hover/label:text-slate-400">Strict Enforcement</span>
                                                </label>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeDocumentType(doc.id)}
                                            className="h-12 w-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-black transition-all active:scale-90"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Add New Protocol */}
                <div className="space-y-6">
                    <Card className="bg-slate-900 border-white/5 rounded-[2.5rem] sm:rounded-[3rem] shadow-2xl overflow-hidden">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-xl font-black text-white uppercase italic tracking-tight">New Parameter</CardTitle>
                            <CardDescription className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Append driver credential requirements.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 pt-4 space-y-6">
                            <div className="space-y-4">
                                <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] px-1">Identification Label</label>
                                <Input
                                    placeholder="Enter Document Name..."
                                    value={newDocName}
                                    onChange={(e) => setNewDocName(e.target.value)}
                                    className="h-16 bg-slate-950 border-white/5 rounded-2xl text-white font-bold focus:border-primary/50 transition-all px-6"
                                />
                            </div>
                            <Button
                                onClick={handleAdd}
                                className="w-full h-16 bg-white hover:bg-slate-100 text-black font-black uppercase rounded-2xl text-[10px] tracking-[0.4em] shadow-xl shadow-white/5 active:scale-95 transition-all"
                            >
                                <Plus className="mr-2 h-5 w-5" /> Execute Addition
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-primary/5 border border-primary/10 rounded-[2.5rem] p-8 space-y-4">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="h-5 w-5 text-primary" />
                            <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Security Note</h4>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-wider">
                            Altering credential protocols will affect all future pilot registrations. Existing data will remain valid until re-validation cycle.
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    )
}

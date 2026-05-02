'use client';

import { useState } from 'react';

export default function SchoolForm({ initial = {}, onSubmit, submitLabel = 'บันทึก', loading = false }) {
  const [form, setForm] = useState({
    name: initial.name ?? '',
    province: initial.province ?? '',
    affiliation: initial.affiliation ?? '',
    level: initial.level ?? '',
    isPublished: Boolean(initial.isPublished),
  });

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit?.(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl bg-white p-6 rounded-xl border shadow-sm">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อโรงเรียน</label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">จังหวัด</label>
        <input
          type="text"
          required
          value={form.province}
          onChange={(e) => setForm((p) => ({ ...p, province: e.target.value }))}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">สังกัด</label>
        <input
          type="text"
          required
          value={form.affiliation}
          onChange={(e) => setForm((p) => ({ ...p, affiliation: e.target.value }))}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">ระดับการศึกษา</label>
        <select
          value={form.level}
          onChange={(e) => setForm((p) => ({ ...p, level: e.target.value }))}
          className="w-full border rounded px-3 py-2"
          required
        >
          <option value="">เลือก</option>
          <option value="ประถมศึกษา">ประถมศึกษา</option>
          <option value="มัธยมศึกษา">มัธยมศึกษา</option>
          <option value="อาชีวศึกษา">อาชีวศึกษา</option>
        </select>
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={form.isPublished}
          onChange={(e) => setForm((p) => ({ ...p, isPublished: e.target.checked }))}
        />
        <span className="text-sm">เผยแพร่ในอันดับสาธารณะ</span>
      </label>
      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'กำลังบันทึก...' : submitLabel}
      </button>
    </form>
  );
}

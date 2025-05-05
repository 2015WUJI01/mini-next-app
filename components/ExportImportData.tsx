'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { exportImportService } from '@/lib/export-import';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

export function ExportImportData() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [exportFilename, setExportFilename] = useState('recipe-meal-data.json');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 处理导出
  const handleExport = () => {
    try {
      setIsExporting(true);
      
      if (!exportImportService) {
        throw new Error('导出服务不可用');
      }
      
      exportImportService.exportToFile(exportFilename);
      toast({
        title: '导出成功',
        description: '所有食谱和饮食安排数据已成功导出'
      });
    } catch (error: any) {
      console.error('导出数据失败:', error);
      toast({
        title: '导出失败',
        description: error.message || '无法导出数据，请稍后重试',
        variant: 'destructive'
      });
    } finally {
      setIsExporting(false);
    }
  };

  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // 处理导入
  const handleImport = async () => {
    if (!selectedFile) {
      toast({
        title: '请选择文件',
        description: '请先选择要导入的数据文件',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsImporting(true);
      
      if (!exportImportService) {
        throw new Error('导入服务不可用');
      }
      
      await exportImportService.importFromFile(selectedFile);
      
      toast({
        title: '导入成功',
        description: '所有食谱和饮食安排数据已成功导入'
      });
      
      // 刷新页面以显示导入的数据
      window.location.reload();
    } catch (error: any) {
      console.error('导入数据失败:', error);
      toast({
        title: '导入失败',
        description: error.message || '无法导入数据，请检查文件格式是否正确',
        variant: 'destructive'
      });
    } finally {
      setIsImporting(false);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">数据导入导出</h2>
      
      {/* 导出数据对话框 */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">导出所有数据</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>导出数据</DialogTitle>
            <DialogDescription>
              导出所有食谱和饮食编排数据。导出的文件可以稍后导入以恢复数据。
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="exportFilename" className="text-right">
                文件名
              </Label>
              <Input
                id="exportFilename"
                className="col-span-3"
                value={exportFilename}
                onChange={(e) => setExportFilename(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">取消</Button>
            </DialogClose>
            <Button onClick={handleExport} disabled={isExporting}>
              {isExporting ? '导出中...' : '导出'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* 导入数据对话框 */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">导入数据</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>导入数据</DialogTitle>
            <DialogDescription>
              导入之前导出的食谱和饮食编排数据。注意：导入将覆盖当前的所有数据。
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="importFile" className="text-right">
                选择文件
              </Label>
              <Input
                id="importFile"
                type="file"
                accept=".json"
                ref={fileInputRef}
                className="col-span-3"
                onChange={handleFileChange}
              />
            </div>
            {selectedFile && (
              <p className="text-sm text-gray-500">
                已选择: {selectedFile.name}
              </p>
            )}
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">取消</Button>
            </DialogClose>
            
            {/* 确认导入对话框 */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button disabled={!selectedFile || isImporting}>
                  {isImporting ? '导入中...' : '导入'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>确认导入数据</AlertDialogTitle>
                  <AlertDialogDescription>
                    此操作将覆盖您当前的所有食谱和饮食编排数据。此操作不可撤销。确定要继续吗？
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>取消</AlertDialogCancel>
                  <AlertDialogAction onClick={handleImport}>
                    确认导入
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 
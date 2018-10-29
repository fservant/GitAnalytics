import { PipeTransform, Pipe } from '@angular/core'

@Pipe({
  name: 'fileFilter'
})

export class FileSearchPipe implements PipeTransform {
  transform(file: any[], searchTerm: string): string[] {
    if (!file || !searchTerm) {
      return file;
    }

    return file.filter(files =>
      files.path.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
  }
}

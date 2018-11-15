import { PipeTransform, Pipe } from '@angular/core'

@Pipe({
  name: 'lineFilter'
})

export class LineSearchPipe implements PipeTransform {
  transform(patch: any[], searchTerm: string): string[] {
    if (!patch || !searchTerm) {
      return patch;
    }

    return patch.filter(patches =>
      patches.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
  }
}

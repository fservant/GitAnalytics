import { PipeTransform, Pipe } from '@angular/core'

@Pipe({
  name: 'commitFilter'
})

export class CommitSearchPipe implements PipeTransform {
  transform(commit: any[], searchTerm: string): string[] {
    if (!commit || !searchTerm) {
      return commit;
    }

    return commit.filter(commits =>
      commits.commit.message.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
  }
}

import { PipeTransform, Pipe } from '@angular/core'

@Pipe({
    name: 'repoFilter'
})

export class RepositorySearchPipe implements PipeTransform {
    transform(repos: any[], searchTerm: string): string[] {
        if (!repos || !searchTerm) {
            return repos;
        }

        return repos.filter(repo =>
            repo.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
    }
}
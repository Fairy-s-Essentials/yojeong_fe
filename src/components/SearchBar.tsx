import { Search } from 'lucide-react';
import { cn } from '@/utils/cn';
import Input from './Input';

export interface SearchBarProps extends React.ComponentProps<'input'> {
  className?: string;
}

const SearchBar = ({ className, ...props }: SearchBarProps) => {
  return (
    <div className={cn('relative w-full', className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-app-gray-400 pointer-events-none" />
      <Input {...props} className='pl-10' />
    </div>
  );
};

export default SearchBar;

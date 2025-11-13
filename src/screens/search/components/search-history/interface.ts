export interface IProps{
    searches: string[];
    setSearch:(text: string) => void;
    delSearchHistory: () => void;
}
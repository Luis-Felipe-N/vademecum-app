import { Label } from "@/components/ui/label";
import MultipleSelector, { type Option } from "@/components/ui/multiselect";

interface QuestionMultipleSelectorProps {
	options: Option[];
	value: Option[];
	onChange: (value: Option[]) => void;
	maxSelected?: number;
}
export default function QuestionMultipleSelector({ options,
	value,
	onChange,
	maxSelected, }: QuestionMultipleSelectorProps) {

	return (
		<div className="*:not-first:mt-2">
			<MultipleSelector
				options={options}
        value={value}
        onChange={onChange}
        placeholder="Selecione a matéria"
        hideClearAllButton
        emptyIndicator={<p className="text-center text-sm">Nenhuma matéria encontrada</p>}
        maxSelected={maxSelected}
				/>
		
		</div>
	);
}

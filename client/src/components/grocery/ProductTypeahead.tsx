import { useState, useRef, useEffect, type FC } from 'react';
import { useStore } from '@store/useStore';
import FormFieldWrapper from '@components/common/FormFieldWrapper';
import Strings from '../../pages/nls/groceries_strings.json';

interface TypeaheadProps {
    value: string;
    onChange: (productId: string, productName: string) => void;
    error?: string;
}

export const ProductTypeahead: FC<TypeaheadProps> = ({ value, onChange, error }) => {
    const { products, getProducts } = useStore();
    const [search, setSearch] = useState(value);
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleSearch = async (val: string) => {
        setSearch(val);
        onChange('', val);
        if (val.length > 0) {
            await getProducts({ search: val, limit: 10, page: 1 }, false);
            setOpen(true);
        } else {
            setOpen(false);
        }
    };

    const handleSelect = (id: string, name: string) => {
        setSearch(name);
        onChange(id, name);
        setOpen(false);
    };

    return (
        <FormFieldWrapper label={Strings.labelProduct} required error={error}>
            <div ref={ref} className="relative">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder={Strings.productPlaceholder}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
                {open && (products?.data?.length ?? 0) > 0 && (
                    <ul className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                        {products!.data.map((p) => (
                            <li
                                key={p.id}
                                onMouseDown={() => handleSelect(p.id, p.name)}
                                className="px-4 py-2 text-sm hover:bg-emerald-50 cursor-pointer text-slate-700"
                            >
                                {p.name}
                                {p.brandName && (
                                    <span className="text-slate-400 ml-1 text-xs">({p.brandName})</span>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </FormFieldWrapper>
    );
};

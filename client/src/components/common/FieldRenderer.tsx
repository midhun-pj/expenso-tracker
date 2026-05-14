
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import ToggleGroupInput from "./ToggleGroupInput";

import type {
    BaseInputProps,
} from "../../models/common.model";

export default function FieldRenderer(
    props: BaseInputProps
) {
    const { field } = props;

    switch (field.type) {
        case "text":
        case "number":
        case "date":
            return (
                <TextInput
                    {...props}
                    field={field}
                />
            );

        case "select":
            return (
                <SelectInput
                    {...props}
                    field={field}
                />
            );


        case "toggle-group":
            return (
                <ToggleGroupInput
                    {...props}
                    field={field}
                />
            );

        default:
            return null;
    }
}
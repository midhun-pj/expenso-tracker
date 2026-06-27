import type { FC } from "react";
import { X } from "lucide-react";

import Strings from "./nls/create_supermarket_strings.json";
import CommonStrings from "../../utils/nls/common_strings.json";

import DynamicForm from "@components/common/DynamicForm";

import type { FormField } from "@models/common.model";

export const CreateSupermarket: FC<any> = ({
  setIsModalOpen,
  addSupermarket,
  editingSupermarket,
  updateSupermarket,
}) => {

  let initialValues: any = {};
  
  const fields: FormField[] = [
    {
      name: "name",
      label: Strings.formLabels.name,
      type: "text",
      validation: {
        required: true,
      },
    },
    {
      name: "location",
      label: Strings.formLabels.location,
      type: "text",
    },
  ];

  if (editingSupermarket.id) {
    initialValues = editingSupermarket;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-lg font-bold text-slate-800">{Strings.title}</h3>
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <section className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <DynamicForm
            fields={fields}
            submitLabel={CommonStrings.create}
            resetOnSubmit={true}
            onSubmit={(values: any) => {
              if (initialValues?.id) {
                updateSupermarket(initialValues.id, {
                  name: values.name,
                  location: values.location,
                });
              } else {
                addSupermarket(values);
              }
              setIsModalOpen(false);
            }}
            initialValues={initialValues}
          />
        </section>
      </div>
    </div>
  );
};

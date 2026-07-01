import type { FC } from "react";
import { X } from "lucide-react";

import Strings from "./nls/create_product_strings.json";
import CommonStrings from "../../utils/nls/common_strings.json";

import DynamicForm from "@components/common/DynamicForm";

import type { FormField } from "@models/common.model";

export const CreateProduct: FC<any> = ({
  setIsModalOpen,
  addProduct,
  editingProduct,
  updateProduct,
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
      name: "brandName",
      label: Strings.formLabels.brand,
      type: "text",
    },
  ];

  if (editingProduct?.id) {
    initialValues = editingProduct;
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
            submitLabel={initialValues?.id? CommonStrings.update: CommonStrings.create}
            resetOnSubmit={true}
            onSubmit={(values: any) => {
              if (initialValues?.id) {
                updateProduct(initialValues.id, {
                  name: values.name,
                  brandName: values.brandName || "",
                });
              } else {
                addProduct(values);
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

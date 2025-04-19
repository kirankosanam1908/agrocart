import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getProducts } from "../api/product";
import { createOrder } from "../api/order";

// Schema definition with Yup
const schema = yup.object().shape({
  buyer_name: yup.string().required("Buyer name is required."),
  buyer_contact: yup.string().required("Contact number is required."),
  delivery_address: yup.string().required("Delivery address is required."),
  items: yup.array().of(
    yup.object().shape({
      productId: yup.string().required(),
      productName: yup.string().required(),
      quantity: yup.number().min(1).required(),
    })
  ),
});

const OrderForm = () => {
  const [products, setProducts] = useState([]);

  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      buyer_name: "",
      buyer_contact: "",
      delivery_address: "",
      items: [{ productId: "", productName: "", quantity: 1 }],
    },
    resolver: yupResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const onSubmit = async (data) => {
    try {
      const formattedData = {
        buyerName: data.buyer_name,
        buyerContact: data.buyer_contact,
        deliveryAddress: data.delivery_address,
        items: data.items.map((item) => ({
          productId: parseInt(item.productId),
          productName: item.productName,
          quantity: parseInt(item.quantity),
        })),
      };

      const response = await createOrder(formattedData);
      alert("Order placed successfully! Order ID: " + response.id);
    } catch (err) {
      console.error("❌ Error placing order:", err);
      alert("Failed to place order.");
    }
  };

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  return (
    <div className="max-w-3xl mt-15 mx-auto p-6 bg-gray-50 rounded-xl shadow-lg animate-fadeIn">
      <h1 className="text-3xl font-bold text-primary mb-4 text-center">
        Place Bulk Order
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 bg-white p-6 rounded-xl shadow-md"
      >
        {/* Buyer Name */}
        <div>
          <input
            {...register("buyer_name")}
            placeholder="Buyer Name"
            className="input w-full"
          />
          <p className="text-red-500 text-sm">{errors.buyer_name?.message}</p>
        </div>

        {/* Contact Number */}
        <div>
          <input
            {...register("buyer_contact")}
            placeholder="Contact Number"
            className="input w-full"
          />
          <p className="text-red-500 text-sm">
            {errors.buyer_contact?.message}
          </p>
        </div>

        {/* Delivery Address */}
        <div>
          <textarea
            {...register("delivery_address")}
            placeholder="Delivery Address"
            className="input w-full"
          />
          <p className="text-red-500 text-sm">
            {errors.delivery_address?.message}
          </p>
        </div>

        <h3 className="text-lg font-semibold mt-4 mb-2">Order Items</h3>
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid grid-cols-3 gap-4 items-center mb-2 animate-slideUp"
          >
            <Controller
              control={control}
              name={`items.${index}.productId`}
              render={({ field: { onChange, value } }) => (
                <select
                  value={value}
                  onChange={(e) => {
                    onChange(e);
                    const selectedProduct = products.find(
                      (product) => product.id === parseInt(e.target.value)
                    );
                    // Update productName using setValue
                    setValue(
                      `items.${index}.productName`,
                      selectedProduct ? selectedProduct.name : ""
                    );
                  }}
                  className="input w-full"
                >
                  <option value="">Select Product</option>
                  {products.map((p) => (
                    <option value={p.id} key={p.id}>
                      {p.name} (₹{p.price})
                    </option>
                  ))}
                </select>
              )}
            />
            <input
              type="number"
              {...register(`items.${index}.quantity`)}
              placeholder="Qty"
              className="input w-full"
            />
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-red-600 hover:text-red-800 transition duration-300"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            append({ productId: "", productName: "", quantity: 1 })
          }
          className="bg-accent text-white px-4 py-2 rounded-md mt-2 w-full transition-transform duration-200 hover:scale-105"
        >
          + Add Item
        </button>

        <button
          type="submit"
          className="bg-primary text-white px-6 py-2 rounded-md hover:bg-green-700 transition duration-300 mt-4 w-full"
        >
          Submit Order
        </button>
      </form>
    </div>
  );
};

export default OrderForm;

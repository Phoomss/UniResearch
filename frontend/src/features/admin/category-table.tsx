import type { CategoryResponse } from "@/src/lib/api/types";

export function CategoryTable({ categories }: { categories: CategoryResponse[] }) {
  return (
    <div className="table-wrap" role="region" aria-label="Current research categories" tabIndex={0}>
      <table className="admin-table"><caption className="sr-only">Current research categories</caption><thead><tr><th scope="col">ID</th><th scope="col">Name</th><th scope="col">Description</th></tr></thead><tbody>{categories.map(category => <tr key={category.id}><td className="mono">{category.id}</td><td>{category.category_name}</td><td>{category.description ?? "Not supplied"}</td></tr>)}</tbody></table>
    </div>
  );
}

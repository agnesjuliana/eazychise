export function buildMeta({
  per_page,
  page,
  total_data,
  sort = "asc",
  sort_by = "id",
  filter_by = "",
}: {
  per_page: number;
  page: number;
  total_data: number;
  sort?: string;
  sort_by?: string;
  filter_by?: string;
}) {
  const total_page = Math.ceil(total_data / per_page);

  return [
    {
      per_page,
      page,
      total_data,
      total_page,
      sort,
      sort_by,
      filter_by,
    },
  ];
}
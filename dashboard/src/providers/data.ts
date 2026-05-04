import { insforge } from "./insforge";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const dataProvider: any = {
  getList: async (params: any) => {
    const resource = params.resource;
    const pagination = params.pagination;
    const filters = params.filters;
    const sorters = params.sorters;

    const current = pagination?.current ?? 1;
    const pageSize = pagination?.pageSize ?? 10;
    const field = sorters?.[0]?.field;
    const order = sorters?.[0]?.order;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query: any = insforge.database.from(resource).select("*");

    if (field && order) {
      query = query.order(`${field}.${order === "asc" ? "asc" : "desc"}`);
    }

    if (filters && filters.length > 0) {
      for (const filter of filters) {
        if (filter.operator === "eq" && "field" in filter) {
          query = query.eq(filter.field, filter.value);
        }
        if (filter.operator === "ne" && "field" in filter) {
          query = query.neq(filter.field, filter.value);
        }
        if (filter.operator === "gt" && "field" in filter) {
          query = query.gt(filter.field, filter.value);
        }
        if (filter.operator === "gte" && "field" in filter) {
          query = query.gte(filter.field, filter.value);
        }
        if (filter.operator === "lt" && "field" in filter) {
          query = query.lt(filter.field, filter.value);
        }
        if (filter.operator === "lte" && "field" in filter) {
          query = query.lte(filter.field, filter.value);
        }
        if (filter.operator === "in" && "field" in filter) {
          query = query.in(filter.field, filter.value);
        }
        if (filter.operator === "contains" && "field" in filter) {
          query = query.like(filter.field, `%${filter.value}%`);
        }
      }
    }

    const rangeStart = (current - 1) * pageSize;
    const rangeEnd = current * pageSize - 1;
    query = query.range(rangeStart, rangeEnd);

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    return {
      data: data ?? [],
      total: count ?? data?.length ?? 0,
    };
  },

  getOne: async (params: any) => {
    const { data, error } = await insforge.database
      .from(params.resource)
      .select("*")
      .eq("id", params.id as string)
      .single();

    if (error) {
      throw error;
    }

    return {
      data: data as any,
    };
  },

  create: async (params: any) => {
    const { data, error } = await insforge.database
      .from(params.resource)
      .insert([params.variables as any]);

    if (error) {
      throw error;
    }

    return {
      data: (Array.isArray(data) ? data[0] : data) as any,
    };
  },

  update: async (params: any) => {
    const { data, error } = await insforge.database
      .from(params.resource)
      .update(params.variables as any)
      .eq("id", params.id as string);

    if (error) {
      throw error;
    }

    return {
      data: data as any,
    };
  },

  deleteOne: async (params: any) => {
    const { data, error } = await insforge.database
      .from(params.resource)
      .delete()
      .eq("id", params.id as string);

    if (error) {
      throw error;
    }

    return {
      data: data as any,
    };
  },

  getMany: async (params: any) => {
    const { data, error } = await insforge.database
      .from(params.resource)
      .select("*")
      .in("id", params.ids as string[]);

    if (error) {
      throw error;
    }

    return {
      data: data as any,
    };
  },

  custom: async (params: any) => {
    const queryBuilder = insforge.database.from(params.url);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query: any = queryBuilder;

    if (params.method === "get" && params.filters) {
      for (const filter of params.filters) {
        if (filter.operator === "eq" && "field" in filter) {
          query = query.eq(filter.field, filter.value);
        }
        if (filter.operator === "contains" && "field" in filter) {
          query = query.like(filter.field, `%${filter.value}%`);
        }
      }
    }

    let result;
    if (params.method === "post") {
      result = await queryBuilder.insert(params.payload as any);
    } else if (params.method === "put" || params.method === "patch") {
      result = await queryBuilder.update(params.payload as any);
    } else if (params.method === "delete") {
      result = await queryBuilder.delete();
    } else {
      result = await query.select("*");
    }

    const { data, error } = result;

    if (error) {
      throw error;
    }

    return {
      data: data as any,
    };
  },

  getApiUrl: () => "",
};

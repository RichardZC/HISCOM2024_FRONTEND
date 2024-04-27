export default async function ({ route, error, $axios }) {
  const params = Object.values(route.params);
  const pathString = String(route.path);
  let path =
    pathString !== "/" && pathString.endsWith("/")
      ? pathString.slice(0, -1)
      : pathString;

  for (const param of params) {
    path = path.replace(`/${param}`, "/*");
  }

  // /employee1/edit/1
  // /employee*/edit/*

  try {
    if (
      path !== "/" &&
      path !== "/login" &&
      path !== "/buscar" &&
      path !== "/marking" &&
      path !== "/payroll" &&
      path !== "/consultar-cita" &&
      path !== "/login/examenes" &&
      path !== "/exam" &&
      !path.includes("/personal")
    ) {
      const { status } = await $axios.get(`/api/common/validate?path=${path}`);
      if (status !== 204) {
        error("Ocurrio un error inesperado");
      }
    }
  } catch (e) {
    error(e);
  }
}

import { RouteType } from './types'

interface GetRouteTypeParams {
  method: string
  url: string
  resourceName: string
}

export interface GetRouteType {
  routeType: RouteType
}

export const getRouteType = ({
  method,
  url,
  resourceName,
}: GetRouteTypeParams): GetRouteType | null => {
  // Exclude the query params from the path
  const realPath = url.split('?')[0]

  if (!realPath.includes(`/${resourceName}`)) {
    throw new Error(
      `invalid resource name '${resourceName}' for route '${realPath}'`
    )
  }

  switch (method) {
    case 'GET': {
      const pathMatch = realPath.match(new RegExp(`/${resourceName}(/.*)?`))
      // If we got a /something after the resource name, we are reading 1 entity
      if (pathMatch && pathMatch[1]) {
        return {
          routeType: RouteType.READ_ONE,
        }
      }

      return {
        routeType: RouteType.READ_ALL,
      }
    }
    case 'POST': {
      const pathMatch = new RegExp(`/${resourceName}$`).test(realPath)

      if (pathMatch) {
        return {
          routeType: RouteType.CREATE,
        }
      }

      return null
    }
    case 'PUT':
    case 'PATCH': {
      const pathMatch = new RegExp(`/${resourceName}/.*$`).test(realPath)

      if (pathMatch) {
        return {
          routeType: RouteType.UPDATE,
        }
      }

      return null
    }
    case 'DELETE': {
      const pathMatch = new RegExp(`/${resourceName}/.*$`).test(realPath)

      if (pathMatch) {
        return {
          routeType: RouteType.DELETE,
        }
      }

      return null
    }
    default: {
      return null
    }
  }
}

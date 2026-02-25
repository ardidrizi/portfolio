/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const RouterContext = createContext({ pathname: '/', navigate: () => {} })

export function RouterProvider({ children }) {
  const [pathname, setPathname] = useState(window.location.pathname)

  useEffect(() => {
    const onPop = () => setPathname(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const value = useMemo(
    () => ({
      pathname,
      navigate: (to) => {
        if (to !== window.location.pathname) {
          window.history.pushState({}, '', to)
          setPathname(to)
        }
      },
    }),
    [pathname],
  )

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
}

export function useRouter() {
  return useContext(RouterContext)
}

export function Link({ to, onClick, children, ...props }) {
  const { navigate } = useRouter()
  return (
    <a
      href={to}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
          return
        }
        event.preventDefault()
        navigate(to)
        onClick?.(event)
      }}
      {...props}
    >
      {children}
    </a>
  )
}

export function NavLink({ to, className, end = false, ...props }) {
  const { pathname } = useRouter()
  const isActive = end ? pathname === to : pathname === to || pathname.startsWith(`${to}/`)
  const classes = typeof className === 'function' ? className({ isActive }) : className

  return <Link to={to} className={classes} {...props} />
}

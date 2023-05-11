import { Wrapper } from '../../lib/urql-ssr'

export default function Layout({ children }: React.PropsWithChildren) {
    return <Wrapper>{children}</Wrapper>;
  }
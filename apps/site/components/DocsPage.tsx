import { ThemeToggle } from '@components/ThemeToggle'
import { allDocsRoutes, docsRoutes } from '@lib/docsRoutes'
import { Menu } from '@tamagui/feather-icons'
import { LogoIcon } from '@tamagui/logo'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import * as React from 'react'
import { useEffect } from 'react'
import { ScrollView } from 'react-native'
import { Button, Paragraph, Separator, Text, Theme, VisuallyHidden, XStack, YStack } from 'tamagui'

import { AlphaButton } from './AlphaButton'
import { ColorToggleButton, useTint } from './ColorToggleButton'
import { Container } from './Container'
import { DocsRouteNavItem } from './DocsRouteNavItem'
import { GithubIcon } from './GithubIcon'
import { Link } from './Link'
import { NavHeading } from './NavHeading'
import { SearchButton } from './SearchButton'

const allNotPending = allDocsRoutes.filter((x) => !x['pending'])

export function DocsPage({ children }: { children: React.ReactNode }) {
  // const { theme } = useTheme()
  const { tint } = useTint()
  const router = useRouter()
  const [open, setOpen] = React.useState(false)

  let currentPath = router.pathname
  let documentVersion = ''
  
  if (Array.isArray(router.query.slug)) {
    currentPath = currentPath.replace('[...slug]', router.query.slug[0])
    documentVersion = router.query.slug[1]
  } else {
    currentPath = currentPath.replace('[slug]', router.query.slug as string)
  }

  const documentVersionPath = documentVersion ? `/${documentVersion}` : ''
  const currentPageIndex = allNotPending.findIndex((page) => page.route === currentPath)
  const previous = allNotPending[currentPageIndex - 1]
  let nextIndex = currentPageIndex + 1
  let next = allNotPending[nextIndex]
  while (next && next.route.startsWith('http')) {
    next = allNotPending[++nextIndex]
  }

  const GITHUB_URL = 'https://github.com'
  const REPO_NAME = 'tamagui/tamagui'
  const editUrl = `${GITHUB_URL}/${REPO_NAME}/edit/master/apps/site/data${currentPath}${documentVersionPath}.mdx`

  useEffect(() => {
    const handleRouteChange = () => {
      setOpen(false)
    }
    router.events.on('routeChangeStart', handleRouteChange)
    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [])

  const menuContents = React.useMemo(() => {
    return (
      <>
        {docsRoutes.map((section, i) => {
          if ('type' in section) {
            if (section.type === 'hr') {
              return (
                <YStack key={`sep-${i}`} mx="$4">
                  {!!section.title ? (
                    <XStack ai="center" space="$6" spaceDirection="horizontal" mb="$2" mt="$3">
                      <Paragraph size="$4">{section.title}</Paragraph>
                      <Separator />
                    </XStack>
                  ) : (
                    <Separator my="$4" />
                  )}
                </YStack>
              )
            }
            return null
          }
          return (
            <YStack key={`${section.label}${i}`} mb="$4">
              {!!section.label && <NavHeading>{section.label}</NavHeading>}
              {section.pages.map((page) => {
                return (
                  <DocsRouteNavItem
                    key={`${page.route}`}
                    href={page.route}
                    active={currentPath === page.route}
                    pending={page['pending']}
                  >
                    {page.title}
                  </DocsRouteNavItem>
                )
              })}
            </YStack>
          )
        })}

        <YStack
          height="$5"
          $gtSm={{
            height: '$8',
          }}
        />
      </>
    )
  }, [docsRoutes, currentPath])

  const pageContents = React.useMemo(() => {
    return (
      <>
        <XStack
          $sm={{ display: 'none' }}
          position="absolute"
          top={15}
          right={30}
          ai="center"
          space="$4"
        >
          <AlphaButton />

          <SearchButton br="$10" elevation="$4" />

          <NextLink href="https://github.com/tamagui/tamagui" passHref>
            <YStack opacity={0.65} hoverStyle={{ opacity: 1 }} tag="a" target="_blank">
              <VisuallyHidden>
                <Text>Github</Text>
              </VisuallyHidden>
              <GithubIcon width={23} />
            </YStack>
          </NextLink>
        </XStack>

        <Container>{children}</Container>

        <Container>
          {(previous || next) && (
            <XStack aria-label="Pagination navigation" my="$9" jc="space-between" space>
              {previous && (
                <NextLink href={previous.route} passHref>
                  <YStack
                    hoverStyle={{
                      borderColor: '$borderColorHover',
                    }}
                    flex={1}
                    width="50%"
                    p="$5"
                    borderRadius="$2"
                    borderWidth={1}
                    borderColor="$borderColor"
                    pressStyle={{
                      backgroundColor: '$backgroundPress',
                    }}
                    tag="a"
                    aria-label={`Previous page: ${previous.title}`}
                    ai="flex-start"
                  >
                    <Paragraph selectable={false} theme="alt1" size="$5">
                      Previous
                    </Paragraph>
                    <Paragraph selectable={false} size="$3" color="$gray10">
                      {previous.title}
                    </Paragraph>
                  </YStack>
                </NextLink>
              )}
              {next && (
                <NextLink href={next.route} passHref>
                  <YStack
                    hoverStyle={{
                      borderColor: '$borderColorHover',
                    }}
                    width="50%"
                    flex={1}
                    p="$5"
                    borderRadius="$2"
                    borderWidth={1}
                    borderColor="$borderColor"
                    pressStyle={{
                      backgroundColor: '$backgroundPress',
                    }}
                    tag="a"
                    aria-label={`Previous page: ${next.title}`}
                    ai="flex-end"
                  >
                    <Paragraph selectable={false} theme="alt1" size="$5">
                      Next
                    </Paragraph>
                    <Paragraph selectable={false} size="$3" color="$gray10">
                      {next.title}
                    </Paragraph>
                  </YStack>
                </NextLink>
              )}
            </XStack>
          )}
        </Container>

        <Container my="$3">
          <Link
            href={editUrl}
            // @ts-ignore
            title="Edit this page on GitHub."
            rel="noopener noreferrer"
            target="_blank"
          >
            Edit this page on GitHub.
          </Link>
        </Container>
      </>
    )
  }, [children, previous, next, editUrl])

  return (
    <Theme name={tint}>
      <YStack
        overflow="hidden"
        $gtSm={{
          flexDirection: 'row',
        }}
        maw={1650}
        pos="relative"
        ov="hidden"
      >
        <YStack
          overflow="hidden"
          className="custom-scroll"
          $gtSm={{
            position: 'fixed' as any,
            top: 0,
            left: 0,
            bottom: 0,
            width: 230,
          }}
        >
          <ScrollView>
            <XStack ai="center" p="$4">
              <Link href="/">
                <VisuallyHidden>
                  <Text>Homepage</Text>
                </VisuallyHidden>
                <LogoIcon downscale={2} />
              </Link>

              <XStack space="$1" ml="auto">
                <ColorToggleButton chromeless />
                <ThemeToggle chromeless />
              </XStack>

              <YStack
                ml="$2"
                $gtSm={{
                  display: 'none',
                }}
              >
                <Button
                  size="$3"
                  chromeless
                  noTextWrap
                  onPress={() => setOpen(!open)}
                  theme={open ? 'alt1' : undefined}
                >
                  <Menu size={16} color="var(--color)" />
                </Button>
              </YStack>
            </XStack>

            <YStack
              display={open ? 'flex' : 'none'}
              mt="$2"
              $gtSm={{
                display: 'block',
              }}
            >
              {menuContents}
            </YStack>
          </ScrollView>
        </YStack>

        <YStack
          maxWidth="100%"
          flex={1}
          py="$5"
          $gtSm={{
            pt: 67,
            pb: '$9',
            pl: 230,
            pr: 0,
          }}
          $gtMd={{
            pr: 150,
          }}
        >
          {pageContents}
        </YStack>
      </YStack>
    </Theme>
  )
}

export type NavItemProps = {
  children: React.ReactNode
  active?: boolean
  href: string
  pending?: boolean
  external?: boolean
}

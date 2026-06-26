import './globals.css'
import { Providers } from './providers'

export const metadata = {
  metadataBase: new URL('https://med-fellows.emergent.host'),
  title: {
    default: 'Med Fellows - MDCAT Preparation & Mock Tests Online',
    template: '%s | Med Fellows'
  },
  description: 'Med Fellows is Pakistan\'s leading MDCAT preparation platform. Practice with thousands of MCQs, take mock tests, and ace your medical entrance exams including MDCAT, NUMS, NTS, Nursing, and FMGE.',
  keywords: ['MDCAT', 'MDCAT preparation', 'MDCAT mock tests', 'medical entrance exam', 'NUMS', 'NTS', 'nursing exam', 'FMGE', 'biology MCQs', 'chemistry MCQs', 'physics MCQs', 'Pakistan medical exam'],
  authors: [{ name: 'Med Fellows' }],
  creator: 'Med Fellows',
  publisher: 'Med Fellows',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    url: 'https://med-fellows.emergent.host',
    siteName: 'Med Fellows',
    title: 'Med Fellows - MDCAT Preparation & Mock Tests Online',
    description: 'Practice with thousands of MCQs and ace your MDCAT, NUMS, NTS, Nursing, and FMGE exams. Join thousands of successful students.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Med Fellows - Your MDCAT Mentors',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Med Fellows - MDCAT Preparation & Mock Tests Online',
    description: 'Practice with thousands of MCQs and ace your MDCAT, NUMS, NTS, Nursing, and FMGE exams.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://med-fellows.emergent.host',
  },
  verification: {
    google: 'verification_token',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{__html:'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);'}} />
        <link rel="canonical" href="https://med-fellows.emergent.host" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'EducationalOrganization',
              name: 'Med Fellows',
              alternateName: 'Med Fellows - Your MDCAT Mentors',
              url: 'https://med-fellows.emergent.host',
              logo: 'https://med-fellows.emergent.host/logo.png',
              description: 'Leading MDCAT and medical entrance exam preparation platform in Pakistan',
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'PK',
              },
              contactPoint: [
                {
                  '@type': 'ContactPoint',
                  telephone: '+92-322-2575722',
                  contactType: 'Customer Service',
                  areaServed: 'PK',
                  availableLanguage: ['English', 'Urdu'],
                },
                {
                  '@type': 'ContactPoint',
                  telephone: '+92-331-7366689',
                  contactType: 'General Inquiries',
                  areaServed: 'PK',
                  availableLanguage: ['English', 'Urdu'],
                },
              ],
              sameAs: [
                'https://facebook.com/medfellows',
                'https://twitter.com/medfellows',
                'https://instagram.com/medfellows',
              ],
              offers: {
                '@type': 'Offer',
                category: 'Educational Services',
                description: 'MDCAT preparation courses and mock tests',
              },
            }),
          }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

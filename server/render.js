import coverFonts from '../shared/templates/book/covers/utils/fonts';
import _ from 'lodash';

// Render Initial HTML
export function mainPage(html, renderedState) {
  const cssPath = process.env.NODE_ENV === 'production' ? '/css/app.styles.css' : '';
  const fbPixel = process.env.FB_PIXEL;
  const cssInclude = cssPath ? `<link rel=\"stylesheet\" href=${cssPath} />` : '';
  const fontIncludes = _.map(coverFonts, (data) => { return data.link; }).join('\n');
  let mainJsPath = '/js/app.bundle.js';

  if (process.env.NODE_ENV === 'production' && process.env.BUNDLE_VERSION) {
  // if (fs.existsSync('/public/js/app.bundle.js') && process.env.NODE_ENV !== 'production') {
    mainJsPath = `${mainJsPath}?${process.env.BUNDLE_VERSION || 0}`;
  }

  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Missionary Memoir</title>

        <link rel="stylesheet" href="/css/bootstrap.min.css" />
        <link href="/css/font-awesome.min.css" rel="stylesheet">
        <link href="/css/custom-animations.css" rel="stylesheet">
        <link href="/css/landing.css" rel="stylesheet">
        ${cssInclude}
        ${fontIncludes}

        <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
        <!--[if lt IE 9]>
          <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
          <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
        <![endif]-->

        <!-- Include emoji -->
        <script src="//twemoji.maxcdn.com/2/twemoji.min.js?2.3.0"></script>
      </head>
      <body>
        <div id="root">${html}</div>

        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(renderedState)};
        </script>

        <script>
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window,document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${fbPixel}');
        fbq('track', 'PageView');
        </script>

        <script>var GA_TRACKING_ID='${process.env.GA_TRACKING_ID}'</script>
        <script src="${mainJsPath}"></script>

        <!-- Theme Javascript Files -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
        <script src="/js/bootstrap.min.js"></script>
        <!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
        <script src="/js/ie10-viewport-bug-workaround.js"></script>

        <!-- Stripe Javascript Files -->
        <script type="text/javascript" src="https://js.stripe.com/v2/"></script>
        <script type="text/javascript">
          Stripe.setPublishableKey('${process.env.STRIPE_PUBLISHABLE_KEY}');
        </script>

      </body>
    </html>
  `;
}

export function adminPage(html, renderedState) {
  const cssPath = process.env.NODE_ENV === 'production' ? '/css/admin.styles.css' : '';
  const cssInclude = cssPath ? `<link rel=\"stylesheet\" href=${cssPath} />` : '';
  const fontIncludes = _.map(coverFonts, (data) => { return data.link; }).join('\n');
  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Misionary Memoir</title>

        <link rel="stylesheet" href="/css/bootstrap.min.css" />
        <link href="/css/font-awesome.min.css" rel="stylesheet">
        ${cssInclude}
        ${fontIncludes}

        <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
        <!--[if lt IE 9]>
          <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
          <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
        <![endif]-->
      </head>
      <body>
        <div id="root">${html}</div>

        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(renderedState)};
        </script>

        <script src="/js/admin.bundle.js"></script>

        <!-- Theme Javascript Files -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
        <script src="/js/bootstrap.min.js"></script>
        <!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
        <script src="/js/ie10-viewport-bug-workaround.js"></script>
      </body>
    </html>
  `;
}

export function experiencePage(html, renderedState) {
  const cssPath = process.env.NODE_ENV === 'production' ? '/css/experience.styles.css' : '';
  const cssInclude = cssPath ? `<link rel=\"stylesheet\" href=${cssPath} />` : '';
  const fontIncludes = _.map(coverFonts, (data) => { return data.link; }).join('\n');
  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Misionary Memoir</title>

        <link rel="stylesheet" href="/css/bootstrap.min.css" />
        <link href="/css/font-awesome.min.css" rel="stylesheet">
        ${cssInclude}
        ${fontIncludes}

        <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
        <!--[if lt IE 9]>
          <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
          <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
        <![endif]-->
      </head>
      <body>
        <div id="root">${html}</div>

        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(renderedState)};
        </script>

        <script src="https://checkout.stripe.com/checkout.js"></script>

        <script src="/js/jquery-1.8.3.min.js"></script>
        <script src="/js/jquery.guillotine.min.js"></script>
        <script src="/js/experience.bundle.js"></script>

        <!-- Theme Javascript Files -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
        <script src="/js/bootstrap.min.js"></script>
        <!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
        <script src="/js/ie10-viewport-bug-workaround.js"></script>
      </body>
    </html>
  `;
}

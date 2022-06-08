import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'antd'
import { Footer } from 'antd/lib/layout/layout'
import { MouseEventHandler } from 'react'
import { useTranslation } from 'react-i18next'
export const FooterBackButton: React.FC<{ onClick?: MouseEventHandler<HTMLElement> }> = ({ onClick }) => {
  const { t } = useTranslation()
  return (
    <Footer style={{ height: '5.625rem', backgroundColor: '#1C1919', textAlign: 'center', width: '100%' }}>
      <Button
        size="large"
        type="default"
        className="box w440"
        onClick={(e) => {
          if (onClick) {
            onClick(e)
          } else {
            window.history.go(-1)
          }
        }}>
        <div className="flex items-center justify-center text-lg">
          <FontAwesomeIcon icon={faArrowLeft} style={{ height: '1.1rem' }} />
          <span className="font-semibold leading-4_5">&nbsp;{t('Back')}</span>
        </div>
      </Button>
    </Footer>
  )
}

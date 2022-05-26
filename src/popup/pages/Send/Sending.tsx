import { LoadingOutlined } from '@ant-design/icons'

export default () => {
  return (
    <div className="flex flex-col items-center mx-auto text-6xl mt-60 gap-3_75 w-95 text-primary">
      <LoadingOutlined />
      <span className="text-2xl text-white">Sending</span>
    </div>
  )
}

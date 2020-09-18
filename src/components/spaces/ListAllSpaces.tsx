import React from 'react';
import { ViewSpacePage } from './ViewSpace';
import DataList from '../utils/DataList';
import { NextPage } from 'next';
import { HeadMeta } from '../utils/HeadMeta';
import BN from 'bn.js';
import { ZERO, ONE } from '../utils';
import { SpaceData } from '@subsocial/types/dto';
import { getSubsocialApi } from '../utils/SubsocialConnect';
import { NewSpaceButton } from './helpers';

type Props = {
  totalCount?: BN
  spacesData?: SpaceData[]
}

export const ListAllSpaces: NextPage<Props> = (props) => {
  const { totalCount = ZERO, spacesData = [] } = props
  const title = `Explore Spaces (${totalCount})`

  return (
    <div className='ui huge relaxed middle aligned divided list ProfilePreviews'>
      <HeadMeta title={title} desc='Find interesting spaces on Subsocial and follow them.' />
      <DataList
        title={title}
        dataSource={spacesData}
        noDataDesc='There are no spaces yet'
        noDataExt={<NewSpaceButton>Create space</NewSpaceButton>}
        renderItem={(item) =>
          <ViewSpacePage
            key={item.struct.id.toString()}
            {...props}
            spaceData={item}
            withFollowButton
            preview
          />
        }
      />
    </div>
  )
}

const firstSpaceId = ONE

// TODO add pagination

ListAllSpaces.getInitialProps = async (_props): Promise<Props> => {
  const subsocial = await getSubsocialApi()
  const { substrate } = subsocial

  const nextSpaceId = await substrate.nextSpaceId()
  const totalCount = nextSpaceId.sub(firstSpaceId)
  let spacesData: SpaceData[] = []

  if (totalCount.gt(ZERO)) {
    const spaceIds: BN[] = []
    for (let id = totalCount; id.gte(firstSpaceId); id = id.sub(ONE)) {
      spaceIds.push(id)
    }
    spacesData = await subsocial.findVisibleSpaces(spaceIds)
  }

  return {
    totalCount,
    spacesData
  }
}

export default ListAllSpaces
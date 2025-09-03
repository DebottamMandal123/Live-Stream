import React from 'react'
import { Wrapper } from './wrapper'
import { Toggle } from './toggle'
import { Recommended, RecommendedSkeleton } from './Recommended'
import { getRecommendedUsers } from '@/lib/recommended-service'

export const Sidebar = async () => {
    const recommendedUsers = await getRecommendedUsers();

    return (
        <Wrapper>
            <Toggle />
            <div className='space-y-4 pt-4 lg:pt-0'>
                <Recommended data={recommendedUsers} />
            </div>
        </Wrapper>
    )
}

export const SidebarSkeleton = () => {
    return (
        <aside className='fixed left-0 flex flex-col w-[70px] lg:w-60 h-full bg-[#252731] border-r border-[#2D2E35] z-50'>
            <RecommendedSkeleton />
        </aside>
    )
}

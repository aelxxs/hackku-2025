import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';
export async function POST(request: NextRequest) {
    try {
        // Parse the request body
        const body = await request.json()
        const icdCodes = body.codes;
        const provider = body.providerID;
        const approvalRates = new Map<string, number>();

        await Promise.all(
            icdCodes.map(async (code: string) => {
               
                const { data: approvedData, count: approvedCount } = await supabase
                    .from('pastapproves')
                    .select('*', { count: 'exact', head: true })
                    .eq('icp', code)
                    .eq('provideID', provider)
                    .eq('approval', true);

                const { data: totalData, count: totalCount } = await supabase
                    .from('pastapproves')
                    .select('*', { count: 'exact', head: true })
                    .eq('icp', code)
                    .eq('provideID', provider);

                console.log("ICD Code: ", code)
                console.log("Approved Count: ", approvedCount)
                console.log("Total Count: ", totalCount)
                console.log("======================")
                if (totalCount && totalCount > 0) {
                    // console.log("ICD Code: ", code)
                    // console.log("Approved Count: ", approvedCount)
                    // console.log("Total Count: ", totalCount)
                    // console.log("======================")
                    const approvalRate = ((approvedCount || 0) / totalCount) * 100;
                    approvalRates.set(code, approvalRate);
                }

            })
        );

        return NextResponse.json(
            {rates:Array.from(approvalRates)}
        );

    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to process request' },
            { status: 500 }
        );
    }
}


 // const { data: approvedData, count: approvedCount } = await supabase
                //     .from('pastApprovals')
                //     .select('*', { count: 'exact', head: true })
                //     .eq('icp', code)
                //     .eq('provideID', provider)
                //     .eq('approval', true);

                // const { data: totalData, count: totalCount } = await supabase
                //     .from('pastApprovals')
                //     .select('*', { count: 'exact', head: true })
                //     .eq('icp', code)
                //     .eq('provideID', provider);

                
                // if (totalCount && totalCount > 0) {
                //     const approvalRate = ((approvedCount || 0) / totalCount) * 100;
                //     approvalRates.set(code, approvalRate);
                // }


// const { data, error } = await supabase.from('commonicd').select().eq('icd', code).limit(1);

                // if (error) {
                //     console.error("Error fetching ICD codes:", error);
                //     return NextResponse.json({ error: "Error fetching ICD codes" }, { status: 500 });
                // }
                
                // if (data && data.length > 0) {
                //     const approvedRate = Math.floor((Math.random() * 10) + 90);
                //     approvalRates.set(code, approvedRate);
                    
                // }
                // else{
                //     const approvedRate = Math.floor((Math.random() * 65)+20);
                //     approvalRates.set(code, approvedRate);
                // }
                // console.log("ICD Code: ", code)
                // console.log(data)
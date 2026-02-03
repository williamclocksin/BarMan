BarMan is an experimental music notation editor, written in TypeScript, in which nothing is assumed.
In the "no assumption" model, bars of music may be unmeasured, contain different numbers of beats, different lengths, and polymetres. Systems may contain any number of staves, and BarMan's formatting algorithms format a system at a time. 
BarMan is a successor to my previous music editor Calliope, which introduced a number of
innovations (such as no assumption formatting) into music notation editing, though the user base was relatively small and development stopped
when NeXTStep folded.  The first release of Calliope (1991) was written in Objective-C.
A more recent project (2023-2024) ported Calliope to Java and JavaFX.  Although it works, the design is unsatisfying because music notation is best modelled using a compusitional (not an inheritance) data structure model, and Java does not support traits and mixins for true data composition.  The most recent version (2025 and still with bugs) ported some of the Java code to Scala in order to experiment with a composition-based data structure model.  This experiment was abandoned because Scala seems to be an academic project that can't decide what kind of language it is as it tries to be everything. It also runs about 5x slower than the Java version. So, I am trying to simplify things, still with composition data structures, by using TypeScript.  I wish I could continue to use JavaFX for the graphics, but I may need to learn something like React.

BarMan's formatting algorithm will format what it can. There is an option to format according to
polymetres with or without coinciding barlines.
The point of this is so the user can draft incomplete music notation without constraint,
and without receiving error messages.

The directory include source from Graphics-Editor by Edison Serrano, which I am using to learn about TypeScript and making a
graphic editor which can eventually become a music notation editor.
